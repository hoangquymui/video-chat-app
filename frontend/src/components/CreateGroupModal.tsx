import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { User } from "../types/user.type";
import { useAppDialog } from "../contexts/AppDialogContext";

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
  const { confirmAction, notify } = useAppDialog();
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
      await notify("Vui lòng nhập tên nhóm");
      return;
    }

    if (members.length === 0) {
      await notify("Vui lòng chọn ít nhất 1 người");
      return;
    }

    const confirmed = await confirmAction({
      title: "Tạo nhóm mới",
      message: `Bạn có chắc muốn tạo nhóm “${groupName.trim()}” với ${members.length} thành viên?`,
      confirmLabel: "Có, tạo nhóm",
    });
    if (!confirmed) return;

    try {
      setLoading(true);

      await onCreate(groupName.trim(), members);

      resetForm();
      onClose();
    } catch {
      await notify("Tạo nhóm thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-white/8 bg-[#0d111b] p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Tạo nhóm gọi</h2>

          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-white/7 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <input
          value={groupName}
          onChange={(event) => setGroupName(event.target.value)}
          placeholder="Tên nhóm"
          className="mt-4 h-9 w-full rounded-md border border-white/8 bg-white/5 px-3 text-sm text-white outline-none focus:border-indigo-400"
        />

        <div className="mt-3 flex h-9 items-center gap-2 rounded-md border border-white/7 bg-white/4 px-3 text-slate-400">
          <Search size={18} />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm kiếm người dùng"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="mt-3 max-h-[280px] overflow-auto">
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
                  className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left hover:bg-white/5 ${
                    checked ? "bg-indigo-500/10" : ""
                  }`}
                >
                  <input type="checkbox" checked={checked} readOnly />

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/8 text-xs font-bold text-white">
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

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={handleClose}
            disabled={loading}
            className="h-9 rounded-md bg-white/7 px-4 text-xs font-semibold text-white hover:bg-white/12 disabled:opacity-60"
          >
            Huỷ
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="h-9 rounded-md bg-indigo-500 px-4 text-xs font-semibold text-white hover:bg-indigo-400 disabled:opacity-60"
          >
            {loading ? "Đang tạo..." : "Tạo nhóm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateGroupModal;
