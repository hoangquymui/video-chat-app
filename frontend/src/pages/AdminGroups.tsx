import { useEffect, useState } from "react";
import {
  deleteRoomApi,
  getMyRoomsApi,
  updateRoomApi,
  createRoomApi,
} from "../api/room.api";
import { getChatUsersApi } from "../api/user.api";
import CreateGroupModal from "../components/CreateGroupModal";
import type { User } from "../types/user.type";
import type { Room } from "../types/room.type";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDialog } from "../contexts/AppDialogContext";

function AdminGroups() {
  const { confirmAction, notify } = useAppDialog();
  const [users, setUsers] = useState<User[]>([]);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editName, setEditName] = useState("");

  const navigate = useNavigate();
  const loadUsers = async () => {
    try {
      const data = await getChatUsersApi();
      setUsers(data);
    } catch {
    }
  };

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await getMyRoomsApi();
      setRooms(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (groupName: string, members: User[]) => {
    await createRoomApi({
      name: groupName,
      memberIds: members.map((member) => member.id),
    });

    await loadRooms();
  };

  useEffect(() => {
    loadRooms();
    loadUsers();
  }, []);

  const openEdit = (room: Room) => {
    setEditingRoom(room);
    setEditName(room.name);
  };

  const closeEdit = () => {
    setEditingRoom(null);
    setEditName("");
  };

  const handleUpdate = async () => {
    if (!editingRoom) return;

    if (!editName.trim()) {
      await notify("Tên nhóm không được để trống");
      return;
    }

    try {
      await updateRoomApi(editingRoom.id, {
        name: editName.trim(),
      });

      closeEdit();
      await loadRooms();
    } catch {
      await notify("Sửa nhóm thất bại");
    }
  };

  const handleDelete = async (room: Room) => {
    const confirmed = await confirmAction({
      title: "Xoá nhóm",
      message: `Bạn có chắc muốn xoá nhóm “${room.name}” không?`,
      confirmLabel: "Có, xoá nhóm",
      tone: "danger",
    });

    if (!confirmed) return;

    try {
      await deleteRoomApi(room.id);
      await loadRooms();
    } catch {
      await notify({ message: "Xoá nhóm thất bại", tone: "danger" });
    }
  };

  return (
    <>
      <CreateGroupModal
        open={groupModalOpen}
        users={users}
        onClose={() => setGroupModalOpen(false)}
        onCreate={handleCreateGroup}
      />
      <main className="min-h-full bg-[#090d15] px-5 py-5 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/7 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                title="Quay lại"
              >
                <ArrowLeft size={17} />
              </button>

              <div>
                <h1 className="text-3xl font-bold">Quản lý nhóm</h1>
                <p className="mt-1 text-slate-400">Danh sách nhóm/phòng họp.</p>
              </div>
            </div>

            <button
              onClick={() => setGroupModalOpen(true)}
              className="flex h-9 items-center gap-2 rounded-lg bg-indigo-500 px-4 text-xs font-semibold text-white transition hover:bg-indigo-400"
            >
              <Plus size={18} />
              Thêm nhóm
            </button>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-white/7 bg-[#0d111b]">
            <table className="w-full text-left">
              <thead className="bg-white/4 text-[11px] uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Tên nhóm</th>
                  <th className="px-5 py-4">Người tạo</th>
                  <th className="px-5 py-4">Số thành viên</th>
                  <th className="px-5 py-4">Ngày tạo</th>
                  <th className="px-5 py-4 text-right">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-slate-400"
                    >
                      Đang tải...
                    </td>
                  </tr>
                ) : rooms.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-slate-400"
                    >
                      Chưa có nhóm nào
                    </td>
                  </tr>
                ) : (
                  rooms.map((room) => (
                    <tr
                      key={room.id}
                      className="border-t border-white/6 text-slate-300 transition hover:bg-white/[0.025]"
                    >
                      <td className="px-5 py-4">{room.id}</td>

                      <td className="px-5 py-4 font-medium text-white">
                        {room.name}
                      </td>

                      <td className="px-5 py-4">{room.createdBy}</td>

                      <td className="px-5 py-4">{room.members?.length ?? 0}</td>

                      <td className="px-5 py-4">
                        {new Date(room.createdAt).toLocaleString("vi-VN")}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(room)}
                            className="rounded-md bg-white/7 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/12"
                          >
                            Sửa
                          </button>

                          <button
                            onClick={() => handleDelete(room)}
                            className="rounded-md bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/25"
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
        </div>

        {editingRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-xl border border-white/8 bg-[#0d111b] p-5 shadow-2xl">
              <h2 className="text-2xl font-bold text-white">Sửa nhóm</h2>

              <div className="mt-5">
                <label className="text-sm text-slate-300">Tên nhóm</label>
                <input
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  className="mt-2 h-9 w-full rounded-md border border-white/8 bg-white/5 px-3 text-sm text-white outline-none focus:border-indigo-400"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={closeEdit}
                  className="h-9 rounded-md bg-white/7 px-4 text-xs font-semibold text-white hover:bg-white/12"
                >
                  Huỷ
                </button>

                <button
                  onClick={handleUpdate}
                  className="h-9 rounded-md bg-indigo-500 px-4 text-xs font-semibold text-white hover:bg-indigo-400"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default AdminGroups;
