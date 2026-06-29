import RemoteVideoCard from "./RemoteVideoCard";
import VideoCard from "./VideoCard";
import type { RefObject } from "react";

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

function VideoGrid({
  localTitle,
  localVideoRef,
  remoteStreams,
}: VideoGridProps) {
  const totalVideos = remoteStreams.length + 1;

  const gridClass =
    totalVideos <= 1
      ? "grid-cols-1"
      : totalVideos <= 4
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

  return (
    <section
      className={`mx-auto grid w-full gap-6 ${
        totalVideos === 1 ? "max-w-2xl grid-cols-1" : `max-w-7xl ${gridClass}`
      }`}
    >
      <VideoCard title={localTitle} videoRef={localVideoRef} />

      {remoteStreams.map((remote) => (
        <RemoteVideoCard
          key={remote.peerId}
          title={remote.name}
          stream={remote.stream}
        />
      ))}
    </section>
  );
}

export default VideoGrid;
