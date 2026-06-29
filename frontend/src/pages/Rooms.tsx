import { useEffect, useMemo, useRef, useState } from "react";
import { Info, Plus, Search, Send, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Group, Panel, Separator } from "react-resizable-panels";
import { getMyRoomsApi, createRoomApi } from "../api/room.api";
import { getChatUsersApi } from "../api/user.api";
import CreateGroupModal from "../components/CreateGroupModal";
import type { Room } from "../types/room.type";
import type { User } from "../types/user.type";
import { useAuth } from "../hooks/useAuth";
import { useRoomChat } from "../hooks/useRoomChat";

function Rooms() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const { selectedRoom, messages, messagesLoading, selectRoom, sendMessage } =
    useRoomChat();

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [messageText, setMessageText] = useState("");

  const [showInfo, setShowInfo] = useState(false);

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

      if (data.length > 0) {
        await selectRoom(data[0]);
      }
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
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

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

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    const content = messageText.trim();
    if (!content) return;

    try {
      setMessageText("");
      await sendMessage(content);
    } catch (error) {
      console.error(error);
      alert("Gửi tin nhắn nhóm thất bại");
    }
  };

  const getAvatarText = (name?: string) => {
    return name?.trim().charAt(0).toUpperCase() || "?";
  };

  const getMemberCount = (room: Room) => {
    return room.members?.length ?? 0;
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
        <Group orientation="horizontal" autoSave="rooms-layout-v2">
          <Panel defaultSize="200px" maxSize="200px" className="bg-slate-900">
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
                        onClick={() => selectRoom(room)}
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
                            {getMemberCount(room)} thành viên
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
                          {getMemberCount(selectedRoom)} thành viên
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

                      <button
                        onClick={() => setShowInfo((prev) => !prev)}
                        className={`rounded-full p-2 transition ${
                          showInfo
                            ? "bg-blue-600 text-white"
                            : "hover:bg-slate-800 text-blue-500"
                        }`}
                      >
                        <Info size={22} />
                      </button>
                    </div>
                  </header>

                  <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-5">
                    {messagesLoading ? (
                      <div className="flex h-full items-center justify-center text-slate-500">
                        Đang tải tin nhắn...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex h-full items-center justify-center text-slate-500">
                        Chưa có tin nhắn nhóm. Hãy gửi tin nhắn đầu tiên.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((message) => {
                          const mine = message.senderId === currentUser?.id;

                          return (
                            <div
                              key={message.id}
                              className={`flex ${
                                mine ? "justify-end" : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                                  mine
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-800 text-slate-100"
                                }`}
                              >
                                <p>{message.content}</p>

                                <p
                                  className={`mt-1 text-[11px] ${
                                    mine ? "text-blue-100" : "text-slate-400"
                                  }`}
                                >
                                  {new Date(
                                    message.createdAt,
                                  ).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                          );
                        })}

                        <div ref={bottomRef} />
                      </div>
                    )}
                  </div>

                  <form
                    onSubmit={handleSendMessage}
                    className="flex shrink-0 items-center gap-3 border-t border-slate-800 px-4 py-4"
                  >
                    <input
                      value={messageText}
                      onChange={(event) => setMessageText(event.target.value)}
                      placeholder={`Nhắn tin vào ${selectedRoom.name}...`}
                      className="flex-1 rounded-full bg-slate-800 px-5 py-3 text-white outline-none placeholder:text-slate-500"
                    />

                    <button
                      type="submit"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center text-slate-500">
                  Chọn phòng họp để bắt đầu chat nhóm
                </div>
              )}
            </section>
          </Panel>

          {showInfo && (
            <>
              <Separator className="w-[3px] cursor-col-resize bg-slate-900 transition-colors hover:bg-blue-600" />

              <Panel defaultSize="300px" className="bg-slate-900">
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
                          {getMemberCount(selectedRoom)} thành viên
                        </p>
                      </div>

                      <div className="mt-8 space-y-4 font-semibold text-slate-200">
                        <button className="flex w-full justify-between hover:text-white">
                          Thành viên
                          <span>{getMemberCount(selectedRoom)}</span>
                        </button>

                        <button className="flex w-full justify-between hover:text-white">
                          Ngày tạo
                          <span>
                            {new Date(
                              selectedRoom.createdAt,
                            ).toLocaleDateString("vi-VN")}
                          </span>
                        </button>

                        <button className="flex w-full justify-between hover:text-white">
                          Quyền riêng tư và hỗ trợ
                          <span>⌄</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-slate-400">
                      Chưa chọn phòng
                    </div>
                  )}
                </aside>
              </Panel>
            </>
          )}
        </Group>
      </main>
    </>
  );
}

export default Rooms;
