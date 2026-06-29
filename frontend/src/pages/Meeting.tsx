import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MessageCircle, Send, X } from "lucide-react";
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
    localStream,
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

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate(`/call/${roomId}`);
  };

  return (
    <main className="relative flex h-full min-h-screen flex-col overflow-hidden bg-slate-950 px-6 py-6 text-white">
      <div className="mb-4 text-center text-sm text-slate-400">
        {onlineUsers.length} người đang trong cuộc gọi
      </div>

      <div className="min-h-0 flex-1">
        <VideoGrid
          localTitle={user?.name ?? "Tôi"}
          localStream={localStream}
          remoteStreams={remoteStreams}
        />
      </div>

      <ControlBar
        joined={joined}
        cameraEnabled={cameraEnabled}
        micEnabled={micEnabled}
        onJoinRoom={joinRoom}
        onLeaveRoom={handleLeaveRoom}
        onToggleCamera={toggleCamera}
        onToggleMic={toggleMic}
      />
    </main>
  );
}

export default Meeting;
