import { api } from "./axios";
import type { Message } from "../types/chat.type";

export const getMeetingMessagesApi = async (meetingCode: string) => {
  const response = await api.get<Message[]>(
    `/chat/meetings/${meetingCode}/messages`,
  );

  return response.data;
};

export const sendMeetingMessageApi = async (
  meetingCode: string,
  content: string,
) => {
  const response = await api.post<Message>(
    `/chat/meetings/${meetingCode}/messages`,
    { content },
  );

  return response.data;
};
