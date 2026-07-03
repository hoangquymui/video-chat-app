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
      className={`group relative block overflow-hidden bg-black text-left transition ${
        small ? "aspect-video w-full rounded-xl" : "h-full w-full rounded-2xl"
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
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <div
            className={`${small ? "text-3xl" : "text-6xl"} font-bold text-slate-300`}
          >
            {title.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      <span
        className={`absolute rounded-full bg-black/65 font-semibold text-white backdrop-blur ${
          small
            ? "bottom-2 left-2 px-2.5 py-1 text-xs"
            : "bottom-4 left-4 px-3 py-1.5 text-sm"
        }`}
      >
        {title}
      </span>
    </button>
  );
}

export default ParticipantCard;
