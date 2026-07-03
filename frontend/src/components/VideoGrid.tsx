import { useEffect, useMemo, useState } from "react";
import ParticipantCard from "./ParticipantCard";
import ControlBar from "./ControlBar";
import { useWebRTCContext } from "../contexts/WebRTCContext";

type VideoGridProps = {
  localTitle: string;
  onLeaveRoom: () => void | Promise<void>;
};

type Participant = {
  id: string;
  title: string;
  isLocal: boolean;
  stream: MediaStream | null;
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

  const [pinnedId, setPinnedId] = useState("local");

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

  return (
    <section className="flex h-full min-h-0 flex-col gap-2">
      {otherParticipants.length > 0 && (
        <div className="shrink-0 rounded-xl border border-slate-800/80 bg-slate-900/60 p-2">
          <div className="custom-scrollbar flex gap-2 overflow-x-auto overflow-y-hidden pb-1">
            {otherParticipants.map((participant) => (
              <div
                key={participant.id}
                className="p-1 w-[150px] shrink-0 rounded-xl transition hover:scale-[1.02]"
              >
                <ParticipantCard
                  title={participant.title}
                  stream={participant.stream}
                  muted={participant.isLocal}
                  small
                  onClick={() => setPinnedId(participant.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative flex min-h-0 flex-1 items-stretch justify-center">
        <div className="pb-15 pr-15 pl-15 pt-5 h-full w-full max-w-6xl overflow-hidden rounded-2xl">
          <ParticipantCard
            title={pinnedParticipant.title}
            stream={pinnedParticipant.stream}
            muted={pinnedParticipant.isLocal}
            active
          />
        </div>

        <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
          <ControlBar
            joined={joined}
            cameraEnabled={cameraEnabled}
            micEnabled={micEnabled}
            onJoinRoom={handleJoinRoom}
            onLeaveRoom={onLeaveRoom}
            onToggleCamera={toggleCamera}
            onToggleMic={toggleMic}
          />
        </div>
      </div>
    </section>
  );
}

export default VideoGrid;
