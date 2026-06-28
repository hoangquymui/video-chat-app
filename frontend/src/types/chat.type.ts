import type { User } from "./user.type";

export type Conversation = {
  id: number;
  userAId: number;
  userBId: number;
  createdAt: string;
};

export type Message = {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  createdAt: string;
};

export type ChatUser = User & {
  conversation?: Conversation;
};
