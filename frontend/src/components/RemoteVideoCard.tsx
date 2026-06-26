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
    <div className="rounded-2xl bg-slate-800 p-4 shadow-lg">
      <h2 className="mb-3 text-lg font-semibold text-white">{title}</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-[300px] w-full rounded-xl bg-black object-cover"
      />
    </div>
  );
}

export default RemoteVideoCard;
