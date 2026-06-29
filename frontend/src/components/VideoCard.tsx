import type { RefObject } from "react";

type VideoCardProps = {
  title: string;
  videoRef: RefObject<HTMLVideoElement | null>;
  onClick?: () => void;
  active?: boolean;
  small?: boolean;
};

function VideoCard({
  title,
  videoRef,
  onClick,
  active,
  small,
}: VideoCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-black text-left shadow-lg ${
        small ? "h-28 w-48 shrink-0" : "aspect-video w-full"
      } ${active ? "ring-2 ring-blue-500" : ""}`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-full object-cover"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />

      <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-sm font-semibold text-white">
        {title}
      </span>
    </button>
  );
}

export default VideoCard;
