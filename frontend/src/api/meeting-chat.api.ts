import { api } from "./axios";
import type { MeetingMessage } from "../types/meeting-chat.type";

export const getMeetingMessagesApi = async (meetingCode: string) => {
  const response = await api.get<MeetingMessage[]>(
    `/chat/meetings/${meetingCode}/messages`,
  );

  return response.data;
};

export const sendMeetingMessageApi = async (
  meetingCode: string,
  content: string,
) => {
  const response = await api.post<MeetingMessage>(
    `/chat/meetings/${meetingCode}/messages`,
    { content },
  );

  return response.data;
};
