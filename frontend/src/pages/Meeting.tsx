import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MessageCircle, Send, X } from "lucide-react";
import Header from "../components/Header";
import ControlBar from "../components/ControlBar";
import VideoGrid from "../components/VideoGrid";
import { useWebRTC } from "../hooks/useWebRTC";
import { useAuth } from "../hooks/useAuth";
import { endMeetingApi, getMeetingByCodeApi } from "../api/meeting.api";
import type { Meeting } from "../types/meeting.type";
import { useMeetingChat } from "../hooks/useMeetingChat";

function Meeting() {
  const { meetingCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);

  const joinedRef = useRef(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [messageText, setMessageText] = useState("");

  const { messages, messagesLoading, sendMessage } = useMeetingChat(
    meeting?.meetingCode ?? "",
  );

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    const content = messageText.trim();
    if (!content) return;

    setMessageText("");
    await sendMessage(content);
  };
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
    <>
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-5 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-white shadow-2xl hover:bg-slate-700"
      >
        <MessageCircle size={20} />
      </button>

      {chatOpen && (
        <aside className="fixed right-0 top-0 z-50 flex h-full w-[360px] flex-col border-l border-slate-800 bg-slate-900 text-white shadow-2xl">
          <header className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
            <h2 className="font-bold">Chat cuộc họp</h2>

            <button
              onClick={() => setChatOpen(false)}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X size={20} />
            </button>
          </header>

          <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {messagesLoading ? (
              <div className="text-center text-sm text-slate-400">
                Đang tải tin nhắn...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-sm text-slate-400">
                Chưa có tin nhắn trong cuộc họp.
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="rounded-2xl bg-slate-800 px-4 py-3 text-sm"
                  >
                    <p>{message.content}</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {new Date(message.createdAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="flex shrink-0 items-center gap-3 border-t border-slate-800 px-4 py-4"
          >
            <input
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              placeholder="Nhập tin nhắn..."
              className="min-w-0 flex-1 rounded-full bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />

            <button
              type="submit"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700"
            >
              <Send size={18} />
            </button>
          </form>
        </aside>
      )}
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
    </>
  );
}

export default Meeting;
