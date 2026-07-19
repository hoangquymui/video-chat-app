import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import { createMeetingApi } from "../api/meeting.api";
import { useWebRTCContext } from "../contexts/WebRTCContext";
import { useAppDialog } from "../contexts/AppDialogContext";

function Call() {
  const { notify } = useAppDialog();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { startMeeting } = useWebRTCContext();

  const handleJoin = async () => {
    if (!roomId) return;

    try {
      setLoading(true);

      const meeting = await createMeetingApi({
        roomId: Number(roomId),
      });

      await startMeeting({
        meetingCode: meeting.meetingCode,
        roomId: meeting.roomId,
        title: meeting.meetingCode,
      });

      navigate(`/meeting/${meeting.meetingCode}`);
    } catch {
      await notify("Không tạo được cuộc họp");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#090d15] px-4 py-4 text-white">
      <Header />

      <section className="mx-auto mt-8 flex max-w-lg flex-col items-center justify-center rounded-xl border border-white/7 bg-[#0d111b] px-6 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-500/15 text-xl font-bold text-indigo-300">
          {user?.name?.charAt(0).toUpperCase() ?? "?"}
        </div>

        <h1 className="mt-6 text-2xl font-bold">Sẵn sàng tham gia cuộc gọi?</h1>

        <p className="mt-2 text-slate-400">
          Bạn sẽ bật camera và micro sau khi vào phòng họp.
        </p>

        <button
          onClick={handleJoin}
          disabled={loading}
          className="mt-6 h-9 rounded-lg bg-indigo-500 px-6 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-60"
        >
          {loading ? "Đang vào..." : "Tham gia"}
        </button>
      </section>
    </main>
  );
}

export default Call;
