import { useEffect, useRef } from "react";

type ParticipantCardProps = {
  title: string;
  stream?: MediaStream | null;
  muted?: boolean;
  small?: boolean;
  active?: boolean;
  onClick?: () => void;
};

function ParticipantCard({
  title,
  stream,
  muted = false,
  small = false,
  active = false,
  onClick,
}: ParticipantCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream ?? null;
    }
  }, [stream]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-black text-left shadow-xl transition ${
        small ? "h-24 w-36 shrink-0" : "aspect-video w-full"
      } ${
        active ? "ring-2 ring-blue-500" : "hover:ring-2 hover:ring-slate-600"
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className="h-full w-full object-cover"
      />

      {!stream && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-700 text-2xl font-bold text-white">
            {title.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      <span className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
        {title}
      </span>
    </button>
  );
}

export default ParticipantCard;
