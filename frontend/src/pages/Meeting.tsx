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
import { useAppDialog } from "../contexts/AppDialogContext";

function MeetingPage() {
  const { notify } = useAppDialog();
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
      } catch {
        await notify("Không tải được cuộc họp");
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
    } catch {
      await notify("Kết thúc cuộc gọi thất bại");
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
    <main className="relative flex h-screen overflow-hidden bg-[#090d15] text-white">
      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-white/7 bg-[#0d111b] px-4">
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

        <div className="min-h-0 flex-1 p-3">
          <VideoGrid
            localTitle={user?.name ?? "Tôi"}
            onLeaveRoom={handleLeaveRoom}
          />
        </div>
      </section>

      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-4 right-4 z-[60] flex h-9 w-9 items-center justify-center rounded-md border border-white/8 bg-[#0d111b] text-slate-300 shadow-xl transition hover:bg-indigo-500/15 hover:text-indigo-300"
        >
          <MessageCircle size={17} />

          {messages.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold">
              {messages.length > 99 ? "99+" : messages.length}
            </span>
          )}
        </button>
      )}

      <aside
        className={`flex shrink-0 flex-col overflow-hidden bg-[#0d111b] text-white transition-[width,opacity] duration-300 ${
          chatOpen
            ? "w-[300px] border-l border-white/7 opacity-100"
            : "w-0 border-l-0 opacity-0"
        }`}
      >
        <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-white/7 px-3">
          <div>
            <h2 className="text-sm font-bold">Chat cuộc họp</h2>
            <p className="text-xs text-slate-400">{messages.length} tin nhắn</p>
          </div>

          <button
            onClick={() => setChatOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/7 hover:text-white"
          >
            <X size={18} />
          </button>
        </header>

        <div className="no-scrollbar min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3 py-4">
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
                    className={`max-w-[94%] border-l-2 px-3 py-2 text-[13px] ${
                      mine
                        ? "border-indigo-400 bg-indigo-500/10 text-slate-100"
                        : "border-slate-600 bg-white/[0.035] text-slate-200"
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
                        mine ? "text-indigo-300/70" : "text-slate-500"
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
          className="border-t border-white/7 p-3"
        >
          <div className="flex h-9 items-center rounded-md border border-white/8 bg-white/5 px-1.5 focus-within:border-indigo-400/60">
            <input
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              placeholder="Nhập tin nhắn..."
              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-slate-500"
            />

            <button
              type="submit"
              className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded bg-indigo-500 transition hover:bg-indigo-400"
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
