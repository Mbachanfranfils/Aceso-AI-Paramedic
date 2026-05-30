import { useCallback, useState, useEffect } from "react";
import { sendMessage, fetchChatHistory } from "@/lib/api";
import type { Message } from "@/types";
import { ERROR_GENERIC } from "@/lib/constants";

interface UseChatResult {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isEmergency: boolean;
  send: (prompt: string, imageBase64?: string) => Promise<void>;
}

export function useChat(sessionId: string | null): UseChatResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmergency, setIsEmergency] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    let mounted = true;
    
    const loadHistory = async () => {
      try {
        const history = await fetchChatHistory(sessionId);
        if (!mounted) return;
        
        const formatted: Message[] = history.map((m: any) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          timestamp: m.created_at,
          is_emergency: m.is_emergency || false,
        }));
        
        setMessages(formatted);
        
        // If the last message was an emergency, show banner
        const lastMsg = formatted[formatted.length - 1];
        if (lastMsg && lastMsg.is_emergency) {
          setIsEmergency(true);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };

    void loadHistory();

    return () => {
      mounted = false;
    };
  }, [sessionId]);

  const send = useCallback(
    async (prompt: string, imageBase64?: string): Promise<void> => {
      if (!sessionId || (!prompt.trim() && !imageBase64) || isLoading) return;
      setError(null);

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: prompt || "Attached an image.",
        timestamp: new Date().toISOString(),
        is_emergency: false,
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const res = await sendMessage({ session_id: sessionId, prompt, image: imageBase64 });
        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: res.message,
          timestamp: new Date().toISOString(),
          is_emergency: res.is_emergency,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsEmergency(res.is_emergency);
      } catch (err: any) {
        console.error("Chat error:", err);
        setError(err.message || ERROR_GENERIC);
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, isLoading],
  );

  return { messages, isLoading, error, isEmergency, send };
}
