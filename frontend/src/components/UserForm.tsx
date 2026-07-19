import { useEffect, useState } from "react";
import type { CreateUserData, UpdateUserData, User } from "../types/user.type";

type UserFormProps = {
  open: boolean;
  mode: "create" | "edit";
  user?: User | null;
  onClose: () => void;
  onSubmit: (data: CreateUserData | UpdateUserData) => Promise<void>;
};

function UserForm({ open, mode, user, onClose, onSubmit }: UserFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && user) {
      setName(user.name);
      setEmail(user.email);
      setPassword("");
      setRole(user.role);
    }

    if (mode === "create") {
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
    }
  }, [mode, user, open]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      if (mode === "create") {
        await onSubmit({
          name,
          email,
          password,
          role,
        });
      } else {
        await onSubmit({
          name,
          email,
          role,
          ...(password ? { password } : {}),
        });
      }

      onClose();
    } catch (error) {
      console.error(error);
      alert("Không thể lưu tài khoản. Vui lòng kiểm tra dữ liệu và thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-white">
          {mode === "create" ? "Thêm user" : "Sửa user"}
        </h2>

        <div className="mt-6">
          <label className="text-sm text-slate-300">Tên</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mt-4">
          <label className="text-sm text-slate-300">Email</label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mt-4">
          <label className="text-sm text-slate-300">
            Mật khẩu {mode === "edit" && "(bỏ trống nếu không đổi)"}
          </label>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            required={mode === "create"}
          />
        </div>

        <div className="mt-4">
          <label className="text-sm text-slate-300">Role</label>
          <select
            value={role}
            onChange={(event) =>
              setRole(event.target.value as "admin" | "user")
            }
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-700 px-5 py-3 font-semibold text-white hover:bg-slate-600"
          >
            Huỷ
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;
