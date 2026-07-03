import { useEffect, useMemo, useState } from "react";
import { useWebRTCContext } from "../contexts/WebRTCContext";
import SpotlightLayout from "./layouts/SpotlightLayout";
import GridLayout from "./layouts/GridLayout";
import SidebarLayout from "./layouts/SidebarLayout";

export type LayoutMode = "spotlight" | "grid" | "sidebar";

export type Participant = {
  id: string;
  title: string;
  isLocal: boolean;
  stream: MediaStream | null;
};

type VideoGridProps = {
  localTitle: string;
  onLeaveRoom: () => void | Promise<void>;
};

function VideoGrid({ localTitle, onLeaveRoom }: VideoGridProps) {
  const {
    localStream,
    remoteStreams,
    joined,
    cameraEnabled,
    micEnabled,
    joinRoom,
    toggleCamera,
    toggleMic,
  } = useWebRTCContext();

  const [pinnedId, setPinnedId] = useState("local");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("spotlight");

  const participants = useMemo<Participant[]>(
    () => [
      {
        id: "local",
        title: localTitle,
        isLocal: true,
        stream: localStream,
      },
      ...remoteStreams.map((remote) => ({
        id: remote.peerId,
        title: remote.name,
        isLocal: false,
        stream: remote.stream,
      })),
    ],
    [localTitle, localStream, remoteStreams],
  );

  useEffect(() => {
    if (!participants.some((item) => item.id === pinnedId)) {
      setPinnedId("local");
    }
  }, [participants, pinnedId]);

  const pinnedParticipant =
    participants.find((item) => item.id === pinnedId) ?? participants[0];

  const otherParticipants = participants.filter(
    (item) => item.id !== pinnedParticipant.id,
  );

  const handleJoinRoom = () => {
    void joinRoom();
  };

  const handleChangeLayout = () => {
    setLayoutMode((prev) => {
      if (prev === "spotlight") return "grid";
      if (prev === "grid") return "sidebar";
      return "spotlight";
    });
  };

  if (layoutMode === "grid") {
    return (
      <GridLayout
        participants={participants}
        joined={joined}
        cameraEnabled={cameraEnabled}
        micEnabled={micEnabled}
        layoutMode={layoutMode}
        onChangeLayout={handleChangeLayout}
        onJoinRoom={handleJoinRoom}
        onLeaveRoom={onLeaveRoom}
        onToggleCamera={toggleCamera}
        onToggleMic={toggleMic}
        onPin={setPinnedId}
      />
    );
  }

  if (layoutMode === "sidebar") {
    return (
      <SidebarLayout
        pinnedParticipant={pinnedParticipant}
        otherParticipants={otherParticipants}
        joined={joined}
        cameraEnabled={cameraEnabled}
        micEnabled={micEnabled}
        layoutMode={layoutMode}
        onChangeLayout={handleChangeLayout}
        onJoinRoom={handleJoinRoom}
        onLeaveRoom={onLeaveRoom}
        onToggleCamera={toggleCamera}
        onToggleMic={toggleMic}
        onPin={setPinnedId}
      />
    );
  }

  return (
    <SpotlightLayout
      participants={participants}
      pinnedParticipant={pinnedParticipant}
      otherParticipants={otherParticipants}
      joined={joined}
      cameraEnabled={cameraEnabled}
      micEnabled={micEnabled}
      layoutMode={layoutMode}
      onChangeLayout={handleChangeLayout}
      onJoinRoom={handleJoinRoom}
      onLeaveRoom={onLeaveRoom}
      onToggleCamera={toggleCamera}
      onToggleMic={toggleMic}
      onPin={setPinnedId}
    />
  );
}

export default VideoGrid;
