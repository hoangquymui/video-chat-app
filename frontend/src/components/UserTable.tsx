import type { User } from "../types/user.type";

type UserTableProps = {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

function UserTable({ users, loading, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <table className="w-full text-left">
        <thead className="bg-slate-800 text-sm text-slate-300">
          <tr>
            <th className="px-5 py-4">ID</th>
            <th className="px-5 py-4">Tên</th>
            <th className="px-5 py-4">Email</th>
            <th className="px-5 py-4">Role</th>
            <th className="px-5 py-4">Ngày tạo</th>
            <th className="px-5 py-4 text-right">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                Đang tải...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                Chưa có user nào
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
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      user.role === "admin"
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-5 py-4">
                  {new Date(user.createdAt).toLocaleString("vi-VN")}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-600"
                    >
                      Sửa
                    </button>

                    <button
                      onClick={() => onDelete(user)}
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Xoá
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
