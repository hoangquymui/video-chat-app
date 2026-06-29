import { api } from "./axios";
import type { CreateMeetingData, Meeting } from "../types/meeting.type";

export const createMeetingApi = async (data: CreateMeetingData) => {
  const response = await api.post<Meeting>("/meetings", data);
  return response.data;
};

export const getMeetingApi = async (id: number) => {
  const response = await api.get<Meeting>(`/meetings/${id}`);
  return response.data;
};

export const getMeetingsByRoomApi = async (roomId: number) => {
  const response = await api.get<Meeting[]>(`/meetings/room/${roomId}`);
  return response.data;
};

export const endMeetingApi = async (id: number) => {
  const response = await api.patch<Meeting>(`/meetings/${id}/end`);
  return response.data;
};

export const getMeetingByCodeApi = async (meetingCode: string) => {
  const response = await api.get(`/meetings/code/${meetingCode}`);

  return response.data;
};
