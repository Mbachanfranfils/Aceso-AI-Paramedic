import type { ChatRequest, ChatResponse } from "@/types";

const API_BASE = "/api/chat";

export const sendMessage = async (payload: ChatRequest): Promise<ChatResponse> => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.statusText}`);
  return res.json() as Promise<ChatResponse>;
};

export const fetchChatHistory = async (session_id: string): Promise<any[]> => {
  const res = await fetch(`${API_BASE}?session_id=${encodeURIComponent(session_id)}`);
  if (!res.ok) throw new Error(`Request failed: ${res.statusText}`);
  return res.json() as Promise<any[]>;
};
