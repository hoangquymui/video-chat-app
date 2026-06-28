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

function AdminGroups() {
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
    } catch (error) {
      console.error(error);
      alert("Không tải được danh sách user");
    }
  };

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await getMyRoomsApi();
      setRooms(data);
    } catch (error) {
      console.error(error);
      alert("Không tải được danh sách nhóm");
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
      alert("Tên nhóm không được để trống");
      return;
    }

    try {
      await updateRoomApi(editingRoom.id, {
        name: editName.trim(),
      });

      closeEdit();
      await loadRooms();
    } catch (error) {
      console.error(error);
      alert("Sửa nhóm thất bại");
    }
  };

  const handleDelete = async (room: Room) => {
    const confirmed = confirm(
      `Bạn có chắc muốn xoá nhóm "${room.name}" không?`,
    );

    if (!confirmed) return;

    try {
      await deleteRoomApi(room.id);
      await loadRooms();
    } catch (error) {
      console.error(error);
      alert("Xoá nhóm thất bại");
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
      <main className="min-h-full bg-slate-950 px-8 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white"
                title="Quay lại"
              >
                <ArrowLeft size={22} />
              </button>

              <div>
                <h1 className="text-3xl font-bold">Quản lý nhóm</h1>
                <p className="mt-1 text-slate-400">Danh sách nhóm/phòng họp.</p>
              </div>
            </div>

            <button
              onClick={() => setGroupModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={18} />
              Thêm nhóm
            </button>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <table className="w-full text-left">
              <thead className="bg-slate-800 text-sm text-slate-300">
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
                      className="border-t border-slate-800 text-slate-300"
                    >
                      <td className="px-5 py-4">{room.id}</td>

                      <td className="px-5 py-4 font-medium text-white">
                        {room.name}
                      </td>

                      <td className="px-5 py-4">{room.createdBy}</td>

                      <td className="px-5 py-4">{room.memberIds.length}</td>

                      <td className="px-5 py-4">
                        {new Date(room.createdAt).toLocaleString("vi-VN")}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(room)}
                            className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-600"
                          >
                            Sửa
                          </button>

                          <button
                            onClick={() => handleDelete(room)}
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
        </div>

        {editingRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white">Sửa nhóm</h2>

              <div className="mt-6">
                <label className="text-sm text-slate-300">Tên nhóm</label>
                <input
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={closeEdit}
                  className="rounded-xl bg-slate-700 px-5 py-3 font-semibold text-white hover:bg-slate-600"
                >
                  Huỷ
                </button>

                <button
                  onClick={handleUpdate}
                  className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
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
