import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Info, Plus, Search, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Group, Panel, Separator } from "react-resizable-panels";
import { getMyRoomsApi, createRoomApi } from "../api/room.api";
import { getChatUsersApi } from "../api/user.api";
import CreateGroupModal from "../components/CreateGroupModal";
import type { Room } from "../types/room.type";
import type { User } from "../types/user.type";

function Rooms() {
  const navigate = useNavigate();

  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  const filteredRooms = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return rooms;

    return rooms.filter((room) => room.name.toLowerCase().includes(q));
  }, [keyword, rooms]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await getMyRoomsApi();

      setRooms(data);
      setSelectedRoom(data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error(error);
      alert("Không tải được danh sách phòng.");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await getChatUsersApi();
      setUsers(data);
    } catch (error) {
      console.error(error);
      alert("Không tải được danh sách người dùng.");
    }
  };

  useEffect(() => {
    loadRooms();
    loadUsers();
  }, []);

  const handleCreateGroup = async (groupName: string, members: User[]) => {
    await createRoomApi({
      name: groupName,
      memberIds: members.map((member) => member.id),
    });

    await loadRooms();
  };

  const getAvatarText = (name?: string) => {
    return name?.trim().charAt(0).toUpperCase() || "?";
  };

  return (
    <>
      <CreateGroupModal
        open={groupModalOpen}
        users={users}
        onClose={() => setGroupModalOpen(false)}
        onCreate={handleCreateGroup}
      />
      <main className="h-full bg-slate-950 text-white">
        <Group orientation="horizontal" autoSave="rooms-layout-v1">
          <Panel defaultSize="250px" className="bg-slate-900">
            <aside className="flex h-full flex-col border-r border-slate-800">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Phòng họp</h1>

                  <button
                    onClick={() => setGroupModalOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700"
                    title="Tạo phòng"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-slate-400">
                  <Search size={18} />
                  <input
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder="Tìm kiếm phòng họp"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-auto px-2 pb-4">
                {loading ? (
                  <div className="px-4 py-6 text-sm text-slate-400">
                    Đang tải danh sách phòng...
                  </div>
                ) : filteredRooms.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-slate-400">
                    Không tìm thấy phòng nào
                  </div>
                ) : (
                  filteredRooms.map((room) => {
                    const active = selectedRoom?.id === room.id;

                    return (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                          active ? "bg-slate-800" : "hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-700 text-lg font-bold text-white">
                          {getAvatarText(room.name)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-white">
                            {room.name}
                          </p>
                          <p className="truncate text-sm text-slate-400">
                            {room.memberIds.length} thành viên
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </aside>
          </Panel>

          <Separator className="w-[3px] cursor-col-resize bg-slate-900 transition-colors hover:bg-blue-600" />

          <Panel minSize={35} className="bg-slate-950">
            <section className="flex h-full min-w-0 flex-col">
              {selectedRoom ? (
                <>
                  <header className="flex h-[74px] shrink-0 items-center justify-between border-b border-slate-800 px-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-700 font-bold text-white">
                        {getAvatarText(selectedRoom.name)}
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate font-bold text-white">
                          {selectedRoom.name}
                        </h2>
                        <p className="truncate text-sm text-slate-400">
                          {selectedRoom.memberIds.length} thành viên
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 text-blue-500">
                      <button
                        onClick={() => navigate(`/call/${selectedRoom.id}`)}
                        className="rounded-full p-2 hover:bg-slate-800"
                        title="Tham gia cuộc gọi"
                      >
                        <Video size={22} />
                      </button>

                      <button className="rounded-full p-2 hover:bg-slate-800">
                        <Info size={22} />
                      </button>
                    </div>
                  </header>

                  <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-800 text-3xl font-bold">
                      {getAvatarText(selectedRoom.name)}
                    </div>

                    <h2 className="mt-6 text-2xl font-bold">
                      {selectedRoom.name}
                    </h2>

                    <p className="mt-2 text-slate-400">
                      Phòng họp này có {selectedRoom.memberIds.length} thành
                      viên.
                    </p>

                    <button
                      onClick={() => navigate(`/call/${selectedRoom.id}`)}
                      className="mt-8 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700"
                    >
                      <Video size={18} />
                      Tham gia phòng
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center text-slate-500">
                  Chọn phòng họp để xem chi tiết
                </div>
              )}
            </section>
          </Panel>

          <Separator className="hidden w-[3px] cursor-col-resize bg-slate-900 transition-colors hover:bg-blue-600 xl:block" />

          <Panel defaultSize="200px" className="hidden bg-slate-900 xl:block">
            <aside className="h-full border-l border-slate-800 p-6">
              {selectedRoom ? (
                <>
                  <div className="flex flex-col items-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-700 text-3xl font-bold text-white">
                      {getAvatarText(selectedRoom.name)}
                    </div>

                    <h2 className="mt-4 text-center text-lg font-bold text-white">
                      {selectedRoom.name}
                    </h2>

                    <p className="mt-1 text-center text-sm text-slate-400">
                      {selectedRoom.memberIds.length} thành viên
                    </p>
                  </div>

                  <div className="mt-8 space-y-4 font-semibold text-slate-200">
                    <button className="flex w-full justify-between hover:text-white">
                      Thành viên
                      <span>{selectedRoom.memberIds.length}</span>
                    </button>

                    <button className="flex w-full justify-between hover:text-white">
                      Ngày tạo
                      <span>
                        {new Date(selectedRoom.createdAt).toLocaleDateString(
                          "vi-VN",
                        )}
                      </span>
                    </button>

                    <button className="flex w-full justify-between hover:text-white">
                      Quyền riêng tư và hỗ trợ
                      <span>⌄</span>
                    </button>
                  </div>

                  <button
                    onClick={() => navigate(`/call/${selectedRoom.id}`)}
                    className="mt-8 w-full rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-700"
                  >
                    Tham gia phòng
                  </button>
                </>
              ) : (
                <div className="text-center text-slate-400">
                  Chưa chọn phòng
                </div>
              )}
            </aside>
          </Panel>
        </Group>
      </main>
    </>
  );
}

export default Rooms;
