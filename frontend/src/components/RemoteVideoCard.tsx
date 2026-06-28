import { useEffect, useRef } from "react";

type RemoteVideoCardProps = {
  title: string;
  stream: MediaStream;
};

function RemoteVideoCard({ title, stream }: RemoteVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900 shadow-lg">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="h-full w-full object-cover"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-4 left-4">
        <span className="rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white backdrop-blur">
          {title}
        </span>
      </div>
    </div>
  );
}

export default RemoteVideoCard;
