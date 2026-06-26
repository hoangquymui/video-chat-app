import { useEffect, useState } from "react";
import { getUsersApi, type User } from "../api/user.api";

function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const data = await getUsersApi();
      setUsers(data);
    } catch (error) {
      console.error(error);
      alert("Không tải được danh sách user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <main className="min-h-full px-8 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-white">Quản lý user</h1>

        <p className="mt-2 text-slate-400">
          Danh sách tài khoản đã đăng ký trong hệ thống.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <table className="w-full text-left">
            <thead className="bg-slate-800 text-sm text-slate-300">
              <tr>
                <th className="px-5 py-4">ID</th>
                <th className="px-5 py-4">Tên</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Ngày tạo</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-slate-400"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-slate-800 text-slate-300"
                  >
                    <td className="px-5 py-4">{user.id}</td>
                    <td className="px-5 py-4 font-medium text-white">
                      {user.name}
                    </td>
                    <td className="px-5 py-4">{user.email}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-700 px-3 py-1 text-sm">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {new Date(user.createdAt).toLocaleString("vi-VN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default AdminUsers;
