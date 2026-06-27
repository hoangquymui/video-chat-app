import Header from "../components/Header";
import VideoCard from "../components/VideoCard";
import RemoteVideoCard from "../components/RemoteVideoCard";
import ControlBar from "../components/ControlBar";
import { useWebRTC } from "../hooks/useWebRTC";
import type { User } from "../types/user.type";

function Call() {
  const {
    localVideoRef,
    remoteStreams,
    joined,
    cameraEnabled,
    micEnabled,
    joinRoom,
    leaveRoom,
    toggleCamera,
    toggleMic,
  } = useWebRTC();

  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 pb-32">
      <Header />

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
        <VideoCard title={user?.name ?? "Tôi"} videoRef={localVideoRef} />

        {remoteStreams.map((remote) => (
          <RemoteVideoCard
            key={remote.peerId}
            title={remote.name}
            stream={remote.stream}
          />
        ))}
      </section>

      <p className="mt-4 text-center text-slate-400">
        Số người đang kết nối: {remoteStreams.length}
      </p>

      <ControlBar
        joined={joined}
        cameraEnabled={cameraEnabled}
        micEnabled={micEnabled}
        onJoinRoom={joinRoom}
        onLeaveRoom={leaveRoom}
        onToggleCamera={toggleCamera}
        onToggleMic={toggleMic}
      />
    </main>
  );
}

export default Call;
