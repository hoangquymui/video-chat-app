import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import ControlBar from "../components/ControlBar";
import VideoGrid from "../components/VideoGrid";
import { useWebRTC } from "../hooks/useWebRTC";
import { useAuth } from "../hooks/useAuth";

function Meeting() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const joinedRef = useRef(false);

  const {
    localVideoRef,
    remoteStreams,
    onlineUsers,
    joined,
    cameraEnabled,
    micEnabled,
    joinRoom,
    leaveRoom,
    toggleCamera,
    toggleMic,
  } = useWebRTC(roomId ?? "test-room");

  useEffect(() => {
    if (joinedRef.current) return;

    joinedRef.current = true;

    joinRoom().catch((error) => {
      console.error(error);
      navigate(`/call/${roomId}`, { replace: true });
    });

    return () => {
      leaveRoom();
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 pb-32">
      <Header />

      <VideoGrid
        localTitle={user?.name ?? "Tôi"}
        localVideoRef={localVideoRef}
        remoteStreams={remoteStreams}
      />

      <p className="mt-4 text-center text-slate-400">
        Số người đang trong cuộc gọi: {onlineUsers.length}
      </p>

      <ControlBar
        joined={joined}
        cameraEnabled={cameraEnabled}
        micEnabled={micEnabled}
        onJoinRoom={joinRoom}
        onLeaveRoom={() => {
          leaveRoom();
          navigate(`/call/${roomId}`);
        }}
        onToggleCamera={toggleCamera}
        onToggleMic={toggleMic}
      />
    </main>
  );
}

export default Meeting;
