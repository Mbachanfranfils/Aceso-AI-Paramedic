import type { ChatRequest, ChatResponse, Message } from "@/types";
import { sendChat, getChatHistory } from "@/lib/chat.functions";

export const sendMessage = async (
  payload: ChatRequest,
): Promise<ChatResponse> => {
  return await sendChat({ data: payload });
};

export const fetchChatHistory = async (session_id: string) => {
  return await getChatHistory({ data: session_id });
};
