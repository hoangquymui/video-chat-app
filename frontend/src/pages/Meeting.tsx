import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MessageCircle, Send, X } from "lucide-react";
import VideoGrid from "../components/VideoGrid";
import { useWebRTCContext } from "../contexts/WebRTCContext";
import { useAuth } from "../hooks/useAuth";
import { endMeetingApi, getMeetingByCodeApi } from "../api/meeting.api";
import type { Meeting } from "../types/meeting.type";
import { useMeetingChat } from "../hooks/useMeetingChat";
import { useActiveMeeting } from "../contexts/ActiveMeetingContext";

function MeetingPage() {
  const { meetingCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setActiveMeeting } = useActiveMeeting();

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [messageText, setMessageText] = useState("");

  const { onlineUsers, leaveRoom, startMeetingPreview } = useWebRTCContext();

  const { messages, messagesLoading, sendMessage } = useMeetingChat(
    meeting?.meetingCode ?? "",
  );

  useEffect(() => {
    const loadMeeting = async () => {
      if (!meetingCode) return;

      try {
        setLoading(true);
        const data = await getMeetingByCodeApi(meetingCode);

        setMeeting(data);
        startMeetingPreview(data.meetingCode);

        setActiveMeeting({
          meetingCode: data.meetingCode,
          roomId: data.roomId,
          title: data.meetingCode,
        });
      } catch (error) {
        console.error(error);
        alert("Không tải được cuộc họp");
        navigate("/rooms", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadMeeting();
  }, [meetingCode, navigate, setActiveMeeting, startMeetingPreview]);

  useEffect(() => {
    const handleUnload = () => {
      void leaveRoom();
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [leaveRoom]);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    const content = messageText.trim();
    if (!content) return;

    setMessageText("");
    await sendMessage(content);
  };

  const handleLeaveRoom = async () => {
    await leaveRoom();

    if (!meeting) return;

    try {
      await endMeetingApi(meeting.id);
      setActiveMeeting(null);
    } catch (error) {
      console.error(error);
      alert("Kết thúc cuộc gọi thất bại");
    } finally {
      navigate("/rooms");
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
    <main className="relative flex h-screen overflow-hidden bg-slate-950 text-white">
      <section
        className={`flex min-w-0 flex-1 flex-col px-3 py-3 transition-all duration-300 ${
          chatOpen ? "pr-[360px]" : ""
        }`}
      >
        <div className="mb-2 flex h-14 items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-4 shadow-lg backdrop-blur">
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold">
              {meeting?.meetingCode ?? "Meeting"}
            </h1>

            <p className="mt-0.5 text-xs text-slate-400">
              {onlineUsers.length} người đang tham gia
            </p>
          </div>

          <div className="shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            ● Đang họp
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <VideoGrid
            localTitle={user?.name ?? "Tôi"}
            onLeaveRoom={handleLeaveRoom}
          />
        </div>
      </section>

      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-24 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-white shadow-2xl transition hover:scale-105 hover:bg-slate-700"
        >
          <MessageCircle size={21} />

          {messages.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold">
              {messages.length > 99 ? "99+" : messages.length}
            </span>
          )}
        </button>
      )}

      <aside
        className={`fixed bottom-3 right-3 top-3 z-50 flex w-[332px] flex-col rounded-2xl border border-slate-800 bg-slate-900/95 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 ${
          chatOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-[calc(100%+1rem)] opacity-0"
        }`}
      >
        <header className="flex h-14 items-center justify-between border-b border-slate-800 px-4">
          <div>
            <h2 className="text-sm font-bold">Chat cuộc họp</h2>
            <p className="text-xs text-slate-400">{messages.length} tin nhắn</p>
          </div>

          <button
            onClick={() => setChatOpen(false)}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </header>

        <div className="no-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-4">
          {messagesLoading ? (
            <div className="pt-10 text-center text-sm text-slate-500">
              Đang tải tin nhắn...
            </div>
          ) : messages.length === 0 ? (
            <div className="pt-10 text-center text-sm text-slate-500">
              Chưa có tin nhắn
            </div>
          ) : (
            messages.map((message) => {
              const mine = message.senderId === user?.id;

              return (
                <div
                  key={message.id}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm shadow ${
                      mine
                        ? "bg-blue-600 text-white"
                        : "border border-slate-700 bg-slate-800 text-slate-100"
                    }`}
                  >
                    {!mine && (
                      <p className="mb-1 text-[11px] font-semibold text-slate-300">
                        Người dùng
                      </p>
                    )}

                    <p className="leading-relaxed">{message.content}</p>

                    <p
                      className={`mt-1.5 text-right text-[10px] ${
                        mine ? "text-blue-100" : "text-slate-400"
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="border-t border-slate-800 p-3"
        >
          <div className="flex items-center rounded-xl bg-slate-800 px-2 py-2">
            <input
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              placeholder="Nhập tin nhắn..."
              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-slate-500"
            />

            <button
              type="submit"
              className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 transition hover:bg-blue-500"
            >
              <Send size={17} />
            </button>
          </div>
        </form>
      </aside>
    </main>
  );
}

export default MeetingPage;
