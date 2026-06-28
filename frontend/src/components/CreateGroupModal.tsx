import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { User } from "../types/user.type";

type CreateGroupModalProps = {
  open: boolean;
  users: User[];
  onClose: () => void;
  onCreate: (groupName: string, members: User[]) => Promise<void>;
};

function CreateGroupModal({
  open,
  users,
  onClose,
  onCreate,
}: CreateGroupModalProps) {
  const [keyword, setKeyword] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredUsers = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    if (!q) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q),
    );
  }, [keyword, users]);

  if (!open) return null;

  const toggleUser = (userId: number) => {
    setSelectedIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const resetForm = () => {
    setKeyword("");
    setGroupName("");
    setSelectedIds([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreate = async () => {
    const members = users.filter((user) => selectedIds.includes(user.id));

    if (!groupName.trim()) {
      alert("Vui lòng nhập tên nhóm");
      return;
    }

    if (members.length === 0) {
      alert("Vui lòng chọn ít nhất 1 người");
      return;
    }

    try {
      setLoading(true);

      await onCreate(groupName.trim(), members);

      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Tạo nhóm thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Tạo nhóm gọi</h2>

          <button
            onClick={handleClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <input
          value={groupName}
          onChange={(event) => setGroupName(event.target.value)}
          placeholder="Tên nhóm"
          className="mt-5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
        />

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-slate-400">
          <Search size={18} />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm kiếm người dùng"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="mt-4 max-h-[320px] overflow-auto">
          {filteredUsers.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-slate-400">
              Không tìm thấy người dùng
            </div>
          ) : (
            filteredUsers.map((user) => {
              const checked = selectedIds.includes(user.id);

              return (
                <button
                  key={user.id}
                  onClick={() => toggleUser(user.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-slate-800 ${
                    checked ? "bg-slate-800" : ""
                  }`}
                >
                  <input type="checkbox" checked={checked} readOnly />

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-sm text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="rounded-xl bg-slate-700 px-5 py-3 font-semibold text-white hover:bg-slate-600 disabled:opacity-60"
          >
            Huỷ
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Đang tạo..." : "Tạo nhóm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateGroupModal;
