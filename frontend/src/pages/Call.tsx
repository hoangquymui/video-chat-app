import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import { useWebRTC } from "../hooks/useWebRTC";

function Call() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { onlineUsers } = useWebRTC(roomId ?? "test-room");

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 pb-32 text-white">
      <Header />

      <section className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-2xl bg-slate-900 px-8 py-16 text-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-700 text-4xl font-bold">
          {user?.name?.charAt(0).toUpperCase() ?? "?"}
        </div>

        <h1 className="mt-6 text-2xl font-bold">Sẵn sàng tham gia cuộc gọi?</h1>

        <p className="mt-2 text-slate-400">
          Bạn sẽ bật camera và micro sau khi vào phòng họp.
        </p>
        <p className="mt-4 text-center text-slate-400">
          <p className="mt-4 text-center text-slate-400">
            Số người đang kết nối: {onlineUsers.length}
          </p>
        </p>

        <button
          onClick={() => navigate(`/meeting/${roomId}`)}
          className="mt-8 rounded-full bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-700"
        >
          Tham gia
        </button>
      </section>
    </main>
  );
}

export default Call;
