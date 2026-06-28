import type { User } from "./user.type";

export type RoomMember = {
  id: number;
  roomId: number;
  userId: number;
  role: "owner" | "member" | string;
  joinedAt: string;
};

export type Room = {
  id: number;
  name: string;
  createdBy: number;
  createdAt: string;
  members: RoomMember[];
};

export type CreateRoomData = {
  name: string;
  memberIds: number[];
};

export type RoomWithMembers = Room & {
  memberUsers?: User[];
};
