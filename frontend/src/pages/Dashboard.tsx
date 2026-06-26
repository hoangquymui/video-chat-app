import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  name: string;
  email: string;
};

function Dashboard() {
  const navigate = useNavigate();

  const userRaw = localStorage.getItem("user");
  const user: User | null = userRaw ? JSON.parse(userRaw) : null;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Xin chào, {user?.name ?? "User"}
            </h1>
            <p className="mt-2 text-slate-400">{user?.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-600 px-5 py-3 font-semibold hover:bg-red-700"
          >
            Đăng xuất
          </button>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <button
            onClick={() => navigate("/room")}
            className="rounded-2xl bg-blue-600 p-8 text-left shadow-xl hover:bg-blue-700"
          >
            <h2 className="text-2xl font-bold">Tạo phòng</h2>
            <p className="mt-2 text-blue-100">Tạo phòng video call mới</p>
          </button>

          <button
            onClick={() => navigate("/room")}
            className="rounded-2xl bg-slate-800 p-8 text-left shadow-xl hover:bg-slate-700"
          >
            <h2 className="text-2xl font-bold">Vào phòng test</h2>
            <p className="mt-2 text-slate-400">Hiện tại dùng room test-room</p>
          </button>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
