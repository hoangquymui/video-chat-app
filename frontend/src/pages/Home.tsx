import Header from "../components/Header";
import VideoCard from "../components/VideoCard";
import RemoteVideoCard from "../components/RemoteVideoCard";
import ControlBar from "../components/ControlBar";
import { useWebRTC } from "../hooks/useWebRTC";

function Home() {
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

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 pb-32">
      <Header />

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
        <VideoCard title="Camera của tôi" videoRef={localVideoRef} />

        {remoteStreams.map((remote, index) => (
          <RemoteVideoCard
            key={remote.peerId}
            title={`Camera tab ${index + 1}`}
            stream={remote.stream}
          />
        ))}
      </section>

      <p className="mt-4 text-center text-slate-400">
        Số tab đang kết nối: {remoteStreams.length}
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

export default Home;
