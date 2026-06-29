import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import ControlBar from "../components/ControlBar";
import VideoGrid from "../components/VideoGrid";
import { useWebRTC } from "../hooks/useWebRTC";
import { useAuth } from "../hooks/useAuth";
import { endMeetingApi, getMeetingByCodeApi } from "../api/meeting.api";
import type { Meeting } from "../types/meeting.type";

function Meeting() {
  const { meetingCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);

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
  } = useWebRTC(meetingCode ? `meeting-${meetingCode}` : "test-meeting");

  useEffect(() => {
    const loadMeeting = async () => {
      if (!meetingCode) return;

      try {
        setLoading(true);
        const data = await getMeetingByCodeApi(meetingCode);
        setMeeting(data);
      } catch (error) {
        console.error(error);
        alert("Không tải được cuộc họp");
        navigate("/rooms", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadMeeting();
  }, [meetingCode, navigate]);

  useEffect(() => {
    if (!meeting || joinedRef.current) return;

    joinedRef.current = true;

    joinRoom().catch((error) => {
      console.error(error);
      navigate(`/call/${meeting.roomId}`, { replace: true });
    });

    return () => {
      leaveRoom();
    };
  }, [meeting]);

  const handleLeaveRoom = async () => {
    leaveRoom();

    if (meeting) {
      await endMeetingApi(meeting.id);
      navigate(`/call/${meeting.roomId}`);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Đang tải cuộc họp...
      </main>
    );
  }

  return (
    <main className="relative flex h-full min-h-screen flex-col overflow-hidden bg-slate-950 px-6 py-6 text-white">
      <Header />

      <div className="mb-3 text-center text-sm text-slate-400">
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
