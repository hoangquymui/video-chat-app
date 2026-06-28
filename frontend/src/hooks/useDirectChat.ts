import { useEffect, useRef, useState } from "react";
import {
  findOrCreateDirectConversationApi,
  getMessagesApi,
  sendMessageApi,
} from "../api/chat.api";
import { socket } from "../services/socket";
import type { Conversation, Message } from "../types/chat.type";
import type { User } from "../types/user.type";

export function useDirectChat() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const conversationIdRef = useRef<number | null>(null);

  const addMessage = (message: Message) => {
    setMessages((prev) => {
      const existed = prev.some((item) => item.id === message.id);

      if (existed) return prev;

      return [...prev, message];
    });
  };

  const selectUser = async (user: User) => {
    try {
      setSelectedUser(user);
      setMessagesLoading(true);

      const conv = await findOrCreateDirectConversationApi(user.id);

      setConversation(conv);
      conversationIdRef.current = conv.id;

      if (!socket.connected) {
        socket.connect();
      }

      socket.emit("join-conversation", {
        conversationId: conv.id,
      });

      const data = await getMessagesApi(conv.id);
      setMessages(data);
    } catch (error) {
      console.error(error);
      alert("Không mở được cuộc trò chuyện");
    } finally {
      setMessagesLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!conversation) return;

    const text = content.trim();

    if (!text) return;

    const newMessage = await sendMessageApi(conversation.id, text);

    addMessage(newMessage);

    socket.emit("send-message", {
      conversationId: conversation.id,
      message: newMessage,
    });
  };

  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      if (conversationIdRef.current !== message.conversationId) {
        return;
      }

      addMessage(message);
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, []);

  return {
    selectedUser,
    conversation,
    messages,
    messagesLoading,
    selectUser,
    sendMessage,
  };
}
