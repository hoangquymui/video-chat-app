import { useEffect, useRef, useState } from "react";
import { getRoomMessagesApi, sendRoomMessageApi } from "../api/chat.api";
import { socket } from "../services/socket";
import type { RoomMessage } from "../types/chat.type";
import type { Room } from "../types/room.type";

export function useRoomChat() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const roomIdRef = useRef<number | null>(null);

  const addMessage = (message: RoomMessage) => {
    setMessages((prev) => {
      const existed = prev.some((item) => item.id === message.id);
      if (existed) return prev;

      return [...prev, message];
    });
  };

  const selectRoom = async (room: Room) => {
    try {
      setSelectedRoom(room);
      setMessagesLoading(true);

      roomIdRef.current = room.id;

      if (!socket.connected) {
        socket.connect();
      }

      socket.emit("join-room-chat", {
        roomId: room.id,
      });

      const data = await getRoomMessagesApi(room.id);
      setMessages(data);
    } catch {
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!selectedRoom) return;

    const text = content.trim();
    if (!text) return;

    const newMessage = await sendRoomMessageApi(selectedRoom.id, text);

    addMessage(newMessage);

    socket.emit("send-room-message", {
      roomId: selectedRoom.id,
      message: newMessage,
    });
  };

  useEffect(() => {
    const handleNewRoomMessage = (message: RoomMessage) => {
      if (roomIdRef.current !== message.roomId) return;

      addMessage(message);
    };

    socket.on("new-room-message", handleNewRoomMessage);

    return () => {
      socket.off("new-room-message", handleNewRoomMessage);
    };
  }, []);

  return {
    selectedRoom,
    messages,
    messagesLoading,
    selectRoom,
    sendMessage,
  };
}
