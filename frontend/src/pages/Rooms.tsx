import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  PanelRightOpen,
  Plus,
  Radio,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Group, Panel, Separator } from "react-resizable-panels";
import {
  createRoomApi,
  getMyRoomsApi,
  removeRoomMemberApi,
} from "../api/room.api";
import { getChatUsersApi } from "../api/user.api";
import CreateGroupModal from "../components/CreateGroupModal";
import type { Room } from "../types/room.type";
import type { User } from "../types/user.type";
import { useAuth } from "../hooks/useAuth";
import { useRoomChat } from "../hooks/useRoomChat";
import { useAppDialog } from "../contexts/AppDialogContext";

function Rooms() {
  const { confirmAction, notify } = useAppDialog();
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
  const [membersExpanded, setMembersExpanded] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState<number | null>(null);

  const filteredRooms = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return rooms;

    return rooms.filter((room) => room.name.toLowerCase().includes(q));
  }, [keyword, rooms]);

  const selectedMemberUsers = useMemo(() => {
    if (!selectedRoom) return [];

    const memberIds = new Set(
      selectedRoom.members?.map((member) => member.userId) ?? [],
    );

    const availableUsers = currentUser
      ? [currentUser, ...users.filter((user) => user.id !== currentUser.id)]
      : users;

    return availableUsers.filter((user) => memberIds.has(user.id));
  }, [currentUser, selectedRoom, users]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await getMyRoomsApi();

      setRooms(data);

      if (data.length > 0) {
        await selectRoom(data[0]);
      }
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await getChatUsersApi();
      setUsers(data);
    } catch {
      setUsers([]);
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

  useEffect(() => {
    setMembersExpanded(false);
  }, [selectedRoom?.id]);

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
    } catch {
      await notify("Gửi tin nhắn nhóm thất bại");
    }
  };

  const handleRemoveMember = async (member: User) => {
    if (!selectedRoom || selectedRoom.createdBy !== currentUser?.id) return;

    const confirmed = await confirmAction({
      title: "Xoá thành viên",
      message: `Bạn có chắc muốn xoá ${member.name} khỏi phòng không?`,
      confirmLabel: "Có, xoá thành viên",
      tone: "danger",
    });
    if (!confirmed) return;

    try {
      setRemovingMemberId(member.id);
      const updatedRoom = await removeRoomMemberApi(selectedRoom.id, member.id);

      setRooms((currentRooms) =>
        currentRooms.map((room) =>
          room.id === updatedRoom.id ? updatedRoom : room,
        ),
      );
      await selectRoom(updatedRoom);
    } catch {
      await notify({
        message: "Không thể xoá thành viên khỏi phòng",
        tone: "danger",
      });
    } finally {
      setRemovingMemberId(null);
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
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <h1 className="text-lg font-bold tracking-tight">Phòng họp</h1>

                  <button
                    onClick={() => setGroupModalOpen(true)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700"
                    title="Tạo phòng"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="mt-3 flex h-8 items-center gap-2 rounded-lg bg-slate-800 px-3 text-slate-400">
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
                        className={`flex w-full items-center gap-2.5 border-l-2 px-2.5 py-2 text-left transition-colors ${
                          active
                            ? "border-indigo-400 bg-indigo-500/8"
                            : "border-transparent hover:bg-white/4"
                        }`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/8 bg-[#171d2a] text-xs font-bold text-indigo-300">
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
                  <header className="flex h-[58px] shrink-0 items-center justify-between border-b border-white/7 bg-[#0b0f18] px-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-indigo-500/15 text-xs font-bold text-indigo-300">
                        {getAvatarText(selectedRoom.name)}
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-semibold text-white">
                          {selectedRoom.name}
                        </h2>
                        <p className="truncate text-[11px] uppercase tracking-wider text-slate-500">
                          {getMemberCount(selectedRoom)} thành viên
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 text-blue-500">
                      <button
                        onClick={() => navigate(`/call/${selectedRoom.id}`)}
                        className="rounded-lg p-2 hover:bg-slate-800"
                        title="Tham gia cuộc gọi"
                      >
                        <Radio size={17} />
                      </button>

                      <button
                        onClick={() => setShowInfo((prev) => !prev)}
                        className={`rounded-full p-2 transition ${
                          showInfo
                            ? "bg-blue-600 text-white"
                            : "text-blue-500 hover:bg-slate-800"
                        }`}
                      >
                        <PanelRightOpen size={17} />
                      </button>
                    </div>
                  </header>

                  <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto bg-[#090d15] px-5 py-4">
                    {messagesLoading ? (
                      <div className="flex h-full items-center justify-center text-slate-500">
                        Đang tải tin nhắn...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex h-full items-center justify-center text-slate-500">
                        Chưa có tin nhắn nhóm. Hãy gửi tin nhắn đầu tiên.
                      </div>
                    ) : (
                      <div className="mx-auto max-w-4xl space-y-1">
                        {messages.map((message) => {
                          const mine = message.senderId === currentUser?.id;

                          return (
                            <article
                              key={message.id}
                              className={`group grid grid-cols-[32px_1fr] gap-3 border-l-2 px-3 py-2.5 transition-colors ${
                                mine
                                  ? "border-indigo-500/60 bg-indigo-500/5"
                                  : "border-transparent hover:bg-white/[0.025]"
                              }`}
                            >
                              <div className={`flex h-8 w-8 items-center justify-center rounded-md text-[11px] font-bold ${mine ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-300"}`}>
                                {getAvatarText(
                                  mine
                                    ? currentUser?.name
                                    : users.find(
                                        (user) => user.id === message.senderId,
                                      )?.name,
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xs font-semibold text-slate-200">
                                    {mine
                                      ? "Bạn"
                                      : users.find(
                                          (user) => user.id === message.senderId,
                                        )?.name ?? "Thành viên"}
                                  </span>
                                  <time className="text-[10px] text-slate-600">
                                    {new Date(
                                      message.createdAt,
                                    ).toLocaleTimeString("vi-VN", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </time>
                                </div>
                                <p className="mt-0.5 whitespace-pre-wrap break-words text-sm leading-5 text-slate-300">
                                  {message.content}
                                </p>
                              </div>
                            </article>
                          );
                        })}

                        <div ref={bottomRef} />
                      </div>
                    )}
                  </div>

                  <form
                    onSubmit={handleSendMessage}
                    className="flex shrink-0 items-center gap-2 border-t border-white/7 bg-[#0b0f18] px-5 py-3"
                  >
                    <input
                      value={messageText}
                      onChange={(event) => setMessageText(event.target.value)}
                      placeholder={`Nhắn tin vào ${selectedRoom.name}...`}
                      className="h-9 flex-1 rounded-md border border-white/8 bg-[#121824] px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500"
                    />

                    <button
                      type="submit"
                      className="flex h-9 w-9 items-center justify-center rounded-md bg-indigo-500 text-white hover:bg-indigo-400"
                    >
                      <Send size={16} />
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
              <Separator className="w-px cursor-col-resize bg-white/7 transition-colors hover:bg-indigo-400" />

              <Panel defaultSize="270px" className="bg-[#0d111b]">
                <aside className="h-full border-l border-white/7 p-4">
                  {selectedRoom ? (
                    <>
                      <div className="flex flex-col items-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-indigo-500/12 text-lg font-bold text-indigo-200 ring-1 ring-indigo-400/20">
                          {getAvatarText(selectedRoom.name)}
                        </div>

                        <h2 className="mt-4 text-center text-lg font-bold text-white">
                          {selectedRoom.name}
                        </h2>

                        <p className="mt-1 text-center text-sm text-slate-400">
                          {getMemberCount(selectedRoom)} thành viên
                        </p>
                      </div>

                      <div className="mt-5 space-y-1 text-xs font-medium text-slate-300">
                        <button
                          onClick={() => setMembersExpanded((value) => !value)}
                          className="flex w-full items-center justify-between rounded-md border border-white/6 bg-white/[0.025] px-3 py-2.5 hover:bg-white/5 hover:text-white"
                        >
                          Thành viên
                          <span className="flex items-center gap-2">
                            {getMemberCount(selectedRoom)}
                            <ChevronDown
                              size={14}
                              className={`transition-transform ${
                                membersExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </span>
                        </button>

                        {membersExpanded && (
                          <div className="space-y-1 rounded-md border border-white/6 bg-black/10 p-1.5">
                            {selectedMemberUsers.map((member) => {
                              const roomMember = selectedRoom.members.find(
                                (item) => item.userId === member.id,
                              );

                              return (
                                <div
                                  key={member.id}
                                  className="flex items-center gap-2.5 rounded-md px-2 py-2 hover:bg-white/5"
                                >
                                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-500/15 text-[11px] font-bold text-indigo-200">
                                    {getAvatarText(member.name)}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-semibold text-slate-200">
                                      {member.name}
                                      {member.id === currentUser?.id && (
                                        <span className="ml-1 font-normal text-slate-500">
                                          (Bạn)
                                        </span>
                                      )}
                                    </p>
                                    <p className="truncate text-[10px] font-normal text-slate-500">
                                      {member.email}
                                    </p>
                                  </div>
                                  {selectedRoom.createdBy === currentUser?.id &&
                                    member.id !== selectedRoom.createdBy && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveMember(member)}
                                        disabled={removingMemberId === member.id}
                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-red-500/15 hover:text-red-300 disabled:cursor-wait disabled:opacity-50"
                                        title="Xoá thành viên khỏi phòng"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    )}
                                  {roomMember?.role === "owner" && (
                                    <span className="rounded bg-amber-400/10 px-1.5 py-0.5 text-[9px] uppercase text-amber-300">
                                      Chủ phòng
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <button className="flex w-full justify-between rounded-md border border-white/6 bg-white/[0.025] px-3 py-2.5 hover:bg-white/5 hover:text-white">
                          Ngày tạo
                          <span>
                            {new Date(
                              selectedRoom.createdAt,
                            ).toLocaleDateString("vi-VN")}
                          </span>
                        </button>

                        <button className="flex w-full justify-between rounded-md border border-white/6 bg-white/[0.025] px-3 py-2.5 hover:bg-white/5 hover:text-white">
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
