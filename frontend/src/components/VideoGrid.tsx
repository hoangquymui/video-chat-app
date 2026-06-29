import { useState, type RefObject } from "react";
import RemoteVideoCard from "./RemoteVideoCard";
import VideoCard from "./VideoCard";

type RemoteStream = {
  peerId: string;
  name: string;
  stream: MediaStream;
};

type VideoGridProps = {
  localTitle: string;
  localVideoRef: RefObject<HTMLVideoElement | null>;
  remoteStreams: RemoteStream[];
};

type PinnedVideo =
  | { type: "local"; id: "local" }
  | { type: "remote"; id: string };

function VideoGrid({
  localTitle,
  localVideoRef,
  remoteStreams,
}: VideoGridProps) {
  const [pinnedVideo, setPinnedVideo] = useState<PinnedVideo>({
    type: "local",
    id: "local",
  });

  const pinnedRemote = remoteStreams.find(
    (remote) =>
      pinnedVideo.type === "remote" && remote.peerId === pinnedVideo.id,
  );

  const isPinnedLocal = pinnedVideo.type === "local";

  return (
    <section className="mx-auto flex h-[calc(100vh-210px)] max-w-7xl flex-col gap-5">
      <div className="no-scrollbar flex shrink-0 gap-4 overflow-x-auto pb-1">
        <VideoCard
          title={localTitle}
          videoRef={localVideoRef}
          small
          active={isPinnedLocal}
          onClick={() => setPinnedVideo({ type: "local", id: "local" })}
        />

        {remoteStreams.map((remote) => (
          <RemoteVideoCard
            key={remote.peerId}
            title={remote.name}
            stream={remote.stream}
            small
            active={
              pinnedVideo.type === "remote" && pinnedVideo.id === remote.peerId
            }
            onClick={() =>
              setPinnedVideo({
                type: "remote",
                id: remote.peerId,
              })
            }
          />
        ))}
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="w-full max-w-5xl">
          {isPinnedLocal || !pinnedRemote ? (
            <VideoCard title={localTitle} videoRef={localVideoRef} />
          ) : (
            <RemoteVideoCard
              title={pinnedRemote.name}
              stream={pinnedRemote.stream}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default VideoGrid;
