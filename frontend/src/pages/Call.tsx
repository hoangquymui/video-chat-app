import { useParams } from "react-router-dom";
import Header from "../components/Header";
import ControlBar from "../components/ControlBar";
import VideoGrid from "../components/VideoGrid";
import { useWebRTC } from "../hooks/useWebRTC";
import { useAuth } from "../hooks/useAuth";

function Call() {
  const { roomId } = useParams();
  const { user } = useAuth();

  const {
    localVideoRef,
    remoteStreams,
    joined,
    cameraEnabled,
    micEnabled,
    onlineUsers,
    joinRoom,
    leaveRoom,
    toggleCamera,
    toggleMic,
  } = useWebRTC(roomId ?? "test-room");

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 pb-32">
      <Header />

      <VideoGrid
        localTitle={user?.name ?? "Tôi"}
        localVideoRef={localVideoRef}
        remoteStreams={remoteStreams}
      />

      <p className="mt-4 text-center text-slate-400">
        <p className="mt-4 text-center text-slate-400">
          Số người đang kết nối: {onlineUsers.length}
        </p>
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
