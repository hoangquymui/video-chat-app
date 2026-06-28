import { useEffect, type RefObject } from "react";

type VideoCardProps = {
  title: string;
  videoRef: RefObject<HTMLVideoElement | null>;
};

function VideoCard({ title, videoRef }: VideoCardProps) {
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, [videoRef]);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900 shadow-lg">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-full object-cover"
      />

      {/* Gradient giúp chữ dễ nhìn */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Tên người dùng */}
      <div className="absolute bottom-4 left-4">
        <span className="rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white backdrop-blur">
          {title}
        </span>
      </div>
    </div>
  );
}

export default VideoCard;
