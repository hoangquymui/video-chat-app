import { api } from "./axios";
import type { CreateRoomData, Room } from "../types/room.type";

export const createRoomApi = async (data: CreateRoomData) => {
  const response = await api.post<Room>("/rooms", data);
  return response.data;
};

export const getMyRoomsApi = async () => {
  const response = await api.get<Room[]>("/rooms/me");
  return response.data;
};

export const updateRoomApi = async (id: number, data: { name?: string }) => {
  const response = await api.patch<Room>(`/rooms/${id}`, data);
  return response.data;
};

export const deleteRoomApi = async (id: number) => {
  const response = await api.delete(`/rooms/${id}`);
  return response.data;
};
