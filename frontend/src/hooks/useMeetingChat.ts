import { useEffect, useState } from "react";
import {
  getMeetingMessagesApi,
  sendMeetingMessageApi,
} from "../api/meeting-chat.api";
import { socket } from "../services/socket";
import type { Message } from "../types/chat.type";

export function useMeetingChat(meetingCode: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const addMessage = (message: Message) => {
    setMessages((prev) => {
      const existed = prev.some((item) => item.id === message.id);
      return existed ? prev : [...prev, message];
    });
  };

  const sendMessage = async (content: string) => {
    if (!meetingCode) return;

    const newMessage = await sendMeetingMessageApi(meetingCode, content);

    addMessage(newMessage);

    socket.emit("send-meeting-message", {
      meetingCode,
      message: newMessage,
    });
  };

  useEffect(() => {
    if (!meetingCode) return;

    const loadMessages = async () => {
      try {
        setMessagesLoading(true);
        const data = await getMeetingMessagesApi(meetingCode);
        setMessages(data);
      } finally {
        setMessagesLoading(false);
      }
    };

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-meeting-chat", {
      meetingCode,
    });

    loadMessages();

    const handleNewMessage = (message: Message) => {
      if (message.meetingCode !== meetingCode) return;
      addMessage(message);
    };

    socket.on("new-meeting-message", handleNewMessage);

    return () => {
      socket.off("new-meeting-message", handleNewMessage);
    };
  }, [meetingCode]);

  return {
    messages,
    messagesLoading,
    sendMessage,
  };
}
