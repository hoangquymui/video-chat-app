import { createContext, useContext, type ReactNode } from "react";

type RemoteStream = {
  peerId: string;
  name: string;
  stream: MediaStream;
};

type OnlineUser = {
  id: number;
  name: string;
};

type MeetingContextValue = {
  localStream: MediaStream | null;
  remoteStreams: RemoteStream[];
  onlineUsers: OnlineUser[];

  joined: boolean;
  cameraEnabled: boolean;
  micEnabled: boolean;

  joinRoom: () => Promise<void>;
  leaveRoom: () => void;
  toggleCamera: () => void;
  toggleMic: () => void;

  handleLeaveRoom: () => void | Promise<void>;
};

const MeetingContext = createContext<MeetingContextValue | null>(null);

type MeetingProviderProps = {
  children: ReactNode;
  value: MeetingContextValue;
};

export function MeetingProvider({ children, value }: MeetingProviderProps) {
  return (
    <MeetingContext.Provider value={value}>{children}</MeetingContext.Provider>
  );
}

export function useMeeting() {
  const context = useContext(MeetingContext);

  if (!context) {
    throw new Error("useMeeting must be used inside MeetingProvider");
  }

  return context;
}
