import { Users, UserRoundCog } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();

  return (
    <main className="min-h-full bg-slate-950 px-5 py-5 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-xl font-bold">Admin</h1>
        <p className="mt-2 text-slate-400">Quản trị hệ thống video call.</p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <button
            onClick={() => navigate("/admin/users")}
            className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-left transition hover:border-indigo-500"
          >
            <UserRoundCog className="text-indigo-400" size={24} />
            <h2 className="mt-4 text-xl font-bold">Quản lý user</h2>
            <p className="mt-2 text-slate-400">
              Thêm, sửa, xoá và phân quyền tài khoản.
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/groups")}
            className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-left transition hover:border-indigo-500"
          >
            <Users className="text-indigo-400" size={24} />
            <h2 className="mt-4 text-xl font-bold">Quản lý nhóm</h2>
            <p className="mt-2 text-slate-400">
              Xem và quản lý các nhóm/phòng họp đã tạo.
            </p>
          </button>
        </div>
      </div>
    </main>
  );
}

export default Admin;
