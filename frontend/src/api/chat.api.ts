import { api } from "./axios";
import type { Conversation, Message } from "../types/chat.type";

export const findOrCreateDirectConversationApi = async (userId: number) => {
  const response = await api.post<Conversation>(`/chat/direct/${userId}`);
  return response.data;
};

export const getMessagesApi = async (conversationId: number) => {
  const response = await api.get<Message[]>(
    `/chat/conversations/${conversationId}/messages`,
  );

  return response.data;
};

export const sendMessageApi = async (
  conversationId: number,
  content: string,
) => {
  const response = await api.post<Message>(
    `/chat/conversations/${conversationId}/messages`,
    { content },
  );

  return response.data;
};
