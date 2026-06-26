import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

function Dashboard() {
  const navigate = useNavigate();

  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <main className="min-h-full px-8 py-8">
      <div className="mx-auto max-w-5xl">
        <div>
          <h1 className="text-3xl font-bold">
            Xin chào, {user?.name ?? "User"}
          </h1>
          <p className="mt-2 text-slate-400">{user?.email}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <button
            onClick={() => navigate("/room")}
            className="rounded-2xl bg-blue-600 p-8 text-left shadow-xl hover:bg-blue-700"
          >
            <h2 className="text-2xl font-bold">Tạo phòng</h2>
            <p className="mt-2 text-blue-100">Tạo phòng video call mới</p>
          </button>

          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/admin/users")}
              className="rounded-2xl bg-slate-800 p-8 text-left shadow-xl hover:bg-slate-700"
            >
              <h2 className="text-2xl font-bold">Quản lý user</h2>
              <p className="mt-2 text-slate-400">
                Xem danh sách tài khoản trong hệ thống
              </p>
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
