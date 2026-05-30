export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  is_emergency: boolean;
}

export interface ChatRequest {
  session_id: string;
  prompt: string;
  image?: string;
}

export type Severity = "low" | "medium" | "high" | "critical";

export interface ChatResponse {
  message: string;
  is_emergency: boolean;
  severity: Severity;
  session_id: string;
}

export interface Session {
  id: string;
  created_at: string;
}
