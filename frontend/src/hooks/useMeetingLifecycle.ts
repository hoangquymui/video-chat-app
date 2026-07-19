import { useCallback, useState } from "react";
import { socket } from "../services/socket";
import type { OnlineUser } from "../types/webrtc.type";
import { useAppDialog } from "../contexts/AppDialogContext";

type ActiveCall = {
  meetingCode: string;
  roomId: number;
  title: string;
};

type UseMeetingLifecycleParams = {
  user:
    | {
        id: number;
        name: string;
      }
    | null
    | undefined;

  meetingCodeRef: React.RefObject<string | null>;
  joinedRef: React.RefObject<boolean>;

  localStreamRef: React.RefObject<MediaStream | null>;

  startLocalCamera: () => Promise<MediaStream>;
  stopLocalCamera: () => void;

  cleanupPeers: () => void;

  registerSocketEvents: () => void;
  unregisterSocketEvents: () => void;

  setOnlineUsers: React.Dispatch<React.SetStateAction<OnlineUser[]>>;
};

export function useMeetingLifecycle({
  user,
  meetingCodeRef,
  joinedRef,
  localStreamRef,
  startLocalCamera,
  stopLocalCamera,
  cleanupPeers,
  registerSocketEvents,
  unregisterSocketEvents,
  setOnlineUsers,
}: UseMeetingLifecycleParams) {
  const { notify } = useAppDialog();
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [joined, setJoined] = useState(false);

  const startMeetingPreview = useCallback(
    (meetingCode: string) => {
      if (!user || !meetingCode) return;

      meetingCodeRef.current = meetingCode;

      if (!socket.connected) {
        socket.connect();
      }

      registerSocketEvents();

      socket.emit("join-room-preview", {
        meetingCode,
        user: {
          id: user.id,
          name: user.name,
        },
      });
    },
    [meetingCodeRef, registerSocketEvents, user],
  );

  const joinRoom = useCallback(
    async (meetingCode?: string) => {
      const currentMeetingCode = meetingCode ?? meetingCodeRef.current;

      if (!user || !currentMeetingCode) {
        await notify("Không tìm thấy thông tin cuộc họp.");
        return;
      }

      if (
        joinedRef.current &&
        meetingCodeRef.current === currentMeetingCode &&
        localStreamRef.current
      ) {
        return;
      }

      meetingCodeRef.current = currentMeetingCode;

      await startLocalCamera();

      if (!socket.connected) {
        socket.connect();
      }

      registerSocketEvents();

      socket.emit("join-room", {
        meetingCode: currentMeetingCode,
        user: {
          id: user.id,
          name: user.name,
        },
      });

      joinedRef.current = true;
      setJoined(true);
    },
    [
      joinedRef,
      localStreamRef,
      meetingCodeRef,
      notify,
      registerSocketEvents,
      startLocalCamera,
      user,
    ],
  );

  const cleanupMeeting = useCallback(() => {
    cleanupPeers();
    stopLocalCamera();
    unregisterSocketEvents();

    meetingCodeRef.current = null;
    joinedRef.current = false;

    setOnlineUsers([]);
    setJoined(false);
  }, [
    cleanupPeers,
    joinedRef,
    meetingCodeRef,
    setOnlineUsers,
    stopLocalCamera,
    unregisterSocketEvents,
  ]);

  const emitLeaveRoom = async (meetingCode: string) => {
    return new Promise<void>((resolve) => {
      socket
        .timeout(1500)
        .emit("leave-room", { meetingCode }, (_error: Error | null) => {
          resolve();
        });
    });
  };

  const leaveRoom = useCallback(async () => {
    const meetingCode = meetingCodeRef.current;

    if (meetingCode) {
      await emitLeaveRoom(meetingCode);
    }

    cleanupMeeting();
  }, [cleanupMeeting, meetingCodeRef]);

  const startMeeting = useCallback(
    async (meeting: ActiveCall) => {
      setActiveCall(meeting);
      startMeetingPreview(meeting.meetingCode);
      await joinRoom(meeting.meetingCode);
    },
    [joinRoom, startMeetingPreview],
  );

  const endCurrentMeeting = useCallback(async () => {
    await leaveRoom();
    setActiveCall(null);
  }, [leaveRoom]);

  return {
    activeCall,
    setActiveCall,
    joined,
    startMeetingPreview,
    joinRoom,
    leaveRoom,
    startMeeting,
    endCurrentMeeting,
  };
}
