import { useEffect, useMemo, useState } from "react";
import ParticipantCard from "./ParticipantCard";

type RemoteStream = {
  peerId: string;
  name: string;
  stream: MediaStream;
};

type VideoGridProps = {
  localTitle: string;
  localStream: MediaStream | null;
  remoteStreams: RemoteStream[];
};

type Participant = {
  id: string;
  title: string;
  isLocal: boolean;
  stream: MediaStream | null;
};

function VideoGrid({ localTitle, localStream, remoteStreams }: VideoGridProps) {
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
    const existed = participants.some((item) => item.id === pinnedId);

    if (!existed) {
      setPinnedId("local");
    }
  }, [participants, pinnedId]);

  const pinnedParticipant =
    participants.find((item) => item.id === pinnedId) ?? participants[0];

  const otherParticipants = participants.filter(
    (item) => item.id !== pinnedParticipant.id,
  );

  return (
    <section className="flex h-full min-h-0 flex-col gap-3">
      <div className="no-scrollbar flex max-h-24 shrink-0 flex-wrap justify-center gap-3 overflow-y-auto px-3">
        {otherParticipants.map((participant) => (
          <ParticipantCard
            key={participant.id}
            title={participant.title}
            stream={participant.stream}
            muted={participant.isLocal}
            small
            onClick={() => setPinnedId(participant.id)}
          />
        ))}
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-3 pb-16">
        <div className="w-full max-w-4xl">
          <ParticipantCard
            title={pinnedParticipant.title}
            stream={pinnedParticipant.stream}
            muted={pinnedParticipant.isLocal}
            active
          />
        </div>
      </div>
    </section>
  );
}

export default VideoGrid;
