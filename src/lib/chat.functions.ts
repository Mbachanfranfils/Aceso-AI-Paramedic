import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { ChatResponse, Severity } from "@/types";

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
  return CRITICAL_PHRASES.some((phrase) => lower.includes(phrase));
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

interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export const sendChat = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ChatInput.parse(data))
  .handler(async ({ data }): Promise<ChatResponse> => {
    const { session_id, prompt, image } = data;
    
    const dbContent = image ? `${prompt || "Attached an image."}\n\n[IMAGE_ATTACHMENT]` : prompt;

    // Emergency fast-path — skip AI entirely
    if (detectEmergency(prompt)) {
      const message =
        "🚨 **Call emergency services immediately. Do not delay.**\n\nWhile waiting:\n1. **Stay calm** and keep the person still.\n2. **Do not move** them unless in immediate danger.\n3. Follow dispatcher instructions.\n\nThis situation requires professional medical intervention right now.";
      try {
        await supabaseAdmin.from("messages").insert([
          { session_id, role: "user", content: prompt, is_emergency: true },
          { session_id, role: "assistant", content: message, is_emergency: true },
        ]);
      } catch (err) {
        console.error("[DB] emergency insert failed:", err);
      }
      return { message, is_emergency: true, severity: "critical", session_id };
    }

    // Load conversation history
    const { data: history } = await supabaseAdmin
      .from("messages")
      .select("role, content")
      .eq("session_id", session_id)
      .order("created_at", { ascending: true })
      .limit(20);

    const messages: AIMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(history ?? []).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: prompt },
    ];

    // Save user message first (non-blocking on failure)
    try {
      await supabaseAdmin.from("messages").insert({
        session_id,
        role: "user",
        content: dbContent,
        is_emergency: false,
      });
    } catch (err) {
      console.error("[DB] user message insert failed:", err);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let raw = "";
    try {
      let aiRes: Response;
      const groqKey = process.env.GROQ_API_KEY;
      if (!groqKey) {
        return { message: "⚠️ **Missing Configuration**\n\nThe AI Paramedic is currently offline because the `GROQ_API_KEY` is not configured in your `.env` file.", is_emergency: false, severity: "low", session_id };
      }

      if (image) {
        // Format for Vision model
        const visionMessages = messages.map(m => {
          if (m.role === "system") return m;
          if (m.role === "assistant") return m;
          return { role: m.role, content: [{ type: "text", text: m.content }] as any[] };
        });

        // Add the image to the last user message
        const lastMsg = visionMessages[visionMessages.length - 1];
        if (lastMsg.role === "user" && Array.isArray(lastMsg.content)) {
          lastMsg.content.push({ type: "image_url", image_url: { url: image } });
        }

        aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.2-90b-vision-preview",
            messages: visionMessages,
            temperature: 0.3,
            max_tokens: 500,
          }),
          signal: controller.signal,
        });

      } else {
        // Route to Groq for Text
        aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages,
            temperature: 0.3,
            max_tokens: 500,
          }),
          signal: controller.signal,
        });
      }

      if (!aiRes.ok) {
        let errorMsg = "AI service unavailable";
        try {
          const errorJson = await aiRes.json();
          if (errorJson?.error?.message) {
            errorMsg = `API Error: ${errorJson.error.message}`;
          } else {
            errorMsg = `API Error: ${aiRes.statusText}`;
          }
        } catch {
          const text = await aiRes.text();
          errorMsg = `API Error (${aiRes.status}): ${text.slice(0, 100)}`;
        }
        console.error("[AI Provider]", errorMsg);
        return { message: `⚠️ **Error**\n\n${errorMsg}`, is_emergency: false, severity: "low", session_id };
      }

      const json = (await aiRes.json()) as {
        choices: Array<{ message: { content: string } }>;
      };
      raw = json.choices?.[0]?.message?.content ?? "";
    } catch (err) {
      let errMsg = "An unexpected error occurred.";
      if (err instanceof Error) {
        if (err.name === "AbortError") errMsg = "Request timed out. Please try again.";
        else errMsg = err.message;
      }
      return { message: `⚠️ **Error**\n\n${errMsg}`, is_emergency: false, severity: "low", session_id };
    } finally {
      clearTimeout(timeout);
    }

    // Parse trailing JSON metadata
    let is_emergency = false;
    let severity: Severity = "low";
    let body = raw.trim();

    const jsonMatch = body.match(/\{[^{}]*"is_emergency"[^{}]*\}\s*$/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]) as {
          is_emergency?: boolean;
          severity?: Severity;
        };
        is_emergency = Boolean(parsed.is_emergency);
        if (parsed.severity) severity = parsed.severity;
        body = body.slice(0, jsonMatch.index).trim();
      } catch {
        /* ignore malformed JSON */
      }
    }

    // Save assistant message (non-blocking on failure)
    try {
      await supabaseAdmin.from("messages").insert({
        session_id,
        role: "assistant",
        content: body,
        is_emergency,
      });
    } catch (err) {
      console.error("[DB] assistant insert failed:", err);
    }

    return { message: body, is_emergency, severity, session_id };
  });

export const getChatHistory = createServerFn({ method: "GET" })
  .inputValidator((session_id: unknown) => z.string().uuid().parse(session_id))
  .handler(async ({ data: session_id }) => {
    try {
      const { data, error } = await supabaseAdmin
        .from("messages")
        .select("id, role, content, created_at, is_emergency")
        .eq("session_id", session_id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("[DB] Failed to load history:", error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error("[DB] History fetch failed:", err);
      return [];
    }
  });
