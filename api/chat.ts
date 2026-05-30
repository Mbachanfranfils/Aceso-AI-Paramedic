import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const ChatInput = z.object({
  session_id: z.string().uuid(),
  prompt: z.string().max(500),
  image: z.string().optional(),
});

const CRITICAL_PHRASES = [
  "not breathing", "unconscious", "severe bleeding",
  "chest pain", "seizure", "unresponsive", "heart attack",
  "stroke", "not responding", "stopped breathing",
  "no pulse", "choking badly", "losing consciousness",
];

function detectEmergency(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  return CRITICAL_PHRASES.some((p) => lower.includes(p));
}

const SYSTEM_PROMPT = `You are Aceso, an AI Paramedic providing concise, evidence-based first aid guidance.

Rules:
- Be calm, clear, and direct. Use short numbered steps.
- ALWAYS remind the user to call emergency services for life-threatening situations.
- Use markdown: **bold** for critical actions, numbered lists for steps.
- Keep responses under 200 words unless the situation requires more.
- Never diagnose. Provide first aid only.

After your guidance, on the very last line, output exactly one JSON object on its own line:
{"is_emergency": true|false, "severity": "low"|"medium"|"high"|"critical"}

is_emergency = true when the situation is life-threatening or needs immediate professional care.`;

function getSupabase() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return res.status(500).json({ error: "GROQ_API_KEY not configured" });
  }

  // --- GET: fetch chat history ---
  if (req.method === "GET") {
    const session_id = req.query.session_id as string;
    if (!session_id) return res.status(400).json({ error: "session_id required" });

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("messages")
      .select("id, role, content, created_at, is_emergency")
      .eq("session_id", session_id)
      .order("created_at", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data || []);
  }

  // --- POST: send message ---
  if (req.method === "POST") {
    const parsed = ChatInput.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

    const { session_id, prompt, image } = parsed.data;
    const supabase = getSupabase();

    const dbContent = image ? `${prompt || "Attached an image."}\n\n[IMAGE_ATTACHMENT]` : prompt;

    if (detectEmergency(prompt)) {
      const message =
        "🚨 **Call emergency services immediately. Do not delay.**\n\nWhile waiting:\n1. **Stay calm** and keep the person still.\n2. **Do not move** them unless in immediate danger.\n3. Follow dispatcher instructions.\n\nThis situation requires professional medical intervention right now.";
      await supabase.from("messages").insert([
        { session_id, role: "user", content: prompt, is_emergency: true },
        { session_id, role: "assistant", content: message, is_emergency: true },
      ]);
      return res.status(200).json({ message, is_emergency: true, severity: "critical", session_id });
    }

    const { data: history } = await supabase
      .from("messages")
      .select("role, content")
      .eq("session_id", session_id)
      .order("created_at", { ascending: true })
      .limit(20);

    const messages: Array<{ role: string; content: any }> = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(history ?? []).map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: prompt },
    ];

    await supabase.from("messages").insert({
      session_id, role: "user", content: dbContent, is_emergency: false,
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let raw = "";
    try {
      let fetchMessages = messages;
      if (image) {
        fetchMessages = messages.map((m) => {
          if (m.role === "user" && m.content === prompt) {
            return {
              role: "user",
              content: [
                { type: "text", text: prompt || "Attached an image." },
                { type: "image_url", image_url: { url: image } },
              ],
            };
          }
          return m;
        });
      }

      const model = image ? "llama-3.2-90b-vision-preview" : "llama-3.3-70b-versatile";
      const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({ model, messages: fetchMessages, temperature: 0.3, max_tokens: 500 }),
        signal: controller.signal,
      });

      if (!aiRes.ok) {
        const errJson = await aiRes.json().catch(() => ({}));
        const errMsg = (errJson as any)?.error?.message || aiRes.statusText;
        return res.status(200).json({ message: `⚠️ **Error**\n\n${errMsg}`, is_emergency: false, severity: "low", session_id });
      }

      const json = await aiRes.json() as { choices: Array<{ message: { content: string } }> };
      raw = json.choices?.[0]?.message?.content ?? "";
    } catch (err) {
      const msg = (err as Error).name === "AbortError" ? "Request timed out." : (err as Error).message;
      return res.status(200).json({ message: `⚠️ **Error**\n\n${msg}`, is_emergency: false, severity: "low", session_id });
    } finally {
      clearTimeout(timeout);
    }

    let is_emergency = false;
    let severity: "low" | "medium" | "high" | "critical" = "low";
    let body = raw.trim();

    const jsonMatch = body.match(/\{[^{}]*"is_emergency"[^{}]*\}\s*$/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]) as { is_emergency?: boolean; severity?: string };
        is_emergency = Boolean(parsed.is_emergency);
        if (parsed.severity) severity = parsed.severity as typeof severity;
        body = body.slice(0, jsonMatch.index).trim();
      } catch { /* ignore */ }
    }

    await supabase.from("messages").insert({ session_id, role: "assistant", content: body, is_emergency });

    return res.status(200).json({ message: body, is_emergency, severity, session_id });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
