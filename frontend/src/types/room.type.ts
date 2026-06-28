import type { User } from "./user.type";

export type Room = {
  id: number;
  name: string;
  createdBy: number;
  memberIds: number[];
  createdAt: string;
};

export type CreateRoomData = {
  name: string;
  memberIds: number[];
};

export type RoomWithMembers = Room & {
  members?: User[];
};
