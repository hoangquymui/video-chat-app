import { useEffect, useMemo, useRef, useState } from "react";
import {
  PanelRightOpen,
  MoreHorizontal,
  Pencil,
  Search,
  Send,
  PhoneCall,
} from "lucide-react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { getChatUsersApi } from "../api/user.api";
import { createRoomApi, findOrCreateDirectRoomApi } from "../api/room.api";
import { useNavigate } from "react-router-dom";
import CreateGroupModal from "../components/CreateGroupModal";
import ContactInfoPanel from "../components/ContactInfoPanel";
import type { User } from "../types/user.type";
import { useAuth } from "../hooks/useAuth";
import { useDirectChat } from "../hooks/useDirectChat";
import { useAppDialog } from "../contexts/AppDialogContext";

function Home() {
  const { notify } = useAppDialog();
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { user: currentUser } = useAuth();

  const { selectedUser, messages, messagesLoading, selectUser, sendMessage } =
    useDirectChat();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [messageText, setMessageText] = useState("");
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [startingCall, setStartingCall] = useState(false);

  const [showInfo, setShowInfo] = useState(false);

  const filteredUsers = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    if (!q) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q),
    );
  }, [keyword, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const data = await getChatUsersApi();

      setUsers(data);

      if (data.length > 0) {
        await selectUser(data[0]);
      }
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    loadUsers();
  }, []);

  const getAvatarText = (name?: string) => {
    return name?.trim().charAt(0).toUpperCase() || "?";
  };

  const handleStartCall = async () => {
    if (!selectedUser || !currentUser || startingCall) return;
    try {
      setStartingCall(true);
      const room = await findOrCreateDirectRoomApi(selectedUser.id);
      navigate(`/call/${room.id}`);
    } catch {
      await notify("Không thể bắt đầu cuộc gọi");
    } finally {
      setStartingCall(false);
    }
  };

  const handleCreateGroup = async (groupName: string, members: User[]) => {
    await createRoomApi({
      name: groupName,
      memberIds: members.map((member) => member.id),
    });
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    const content = messageText.trim();

    if (!content) return;

    try {
      setMessageText("");
      await sendMessage(content);
    } catch {
      await notify("Gửi tin nhắn thất bại");
    }
  };

  return (
    <>
      <main className="h-full bg-slate-950 text-white">
        <Group orientation="horizontal" autoSave="home-chat-layout-v2">
          <Panel defaultSize="200px" maxSize="200px" className="bg-slate-900">
            <aside className="flex h-full flex-col border-r border-slate-800">
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <h1 className="text-lg font-bold tracking-tight">Chat</h1>

                  <div className="flex gap-2">
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700">
                      <MoreHorizontal size={20} />
                    </button>

                    <button
                      onClick={() => setGroupModalOpen(true)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700"
                      title="Tạo nhóm gọi"
                    >
                      <Pencil size={20} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex h-8 items-center gap-2 rounded-lg bg-slate-800 px-3 text-slate-400">
                  <Search size={18} />
                  <input
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder="Tìm kiếm người dùng"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-auto px-2 pb-4">
                {loading ? (
                  <div className="px-4 py-6 text-sm text-slate-400">
                    Đang tải danh sách user...
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-slate-400">
                    Không tìm thấy user nào
                  </div>
                ) : (
                  filteredUsers.map((user) => {
                    const active = selectedUser?.id === user.id;

                    return (
                      <button
                        key={user.id}
                        onClick={() => selectUser(user)}
                        className={`flex w-full items-center gap-2.5 border-l-2 px-2.5 py-2 text-left transition-colors ${
                          active
                            ? "border-indigo-400 bg-indigo-500/8"
                            : "border-transparent hover:bg-white/4"
                        }`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/8 bg-[#171d2a] text-xs font-bold text-indigo-300">
                          {getAvatarText(user.name)}
                        </div>

                        <div className="min-w-0 flex-1">
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
            </aside>
          </Panel>

          <Separator className="w-[3px] cursor-col-resize bg-slate-900 transition-colors hover:bg-blue-600" />

          <Panel minSize={35} className="bg-slate-950">
            <section className="flex h-full min-w-0 flex-col">
              {selectedUser ? (
                <>
                  <header className="flex h-[58px] shrink-0 items-center justify-between border-b border-white/7 bg-[#0b0f18] px-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-indigo-500/15 text-xs font-bold text-indigo-300">
                        {getAvatarText(selectedUser.name)}
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-semibold text-white">
                          {selectedUser.name}
                        </h2>
                        <p className="truncate text-[11px] uppercase tracking-wider text-slate-500">
                          Direct workspace · {selectedUser.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 text-blue-500">
                      <button
                        onClick={handleStartCall}
                        disabled={startingCall}
                        className="rounded-lg p-2 hover:bg-slate-800 disabled:opacity-50"
                        title="Bắt đầu gọi video"
                      >
                        <PhoneCall size={18} />
                      </button>

                      <button
                        onClick={() => setShowInfo((prev) => !prev)}
                        className={`rounded-full p-2 transition ${
                          showInfo
                            ? "bg-blue-600 text-white"
                            : "hover:bg-slate-800 text-blue-500"
                        }`}
                      >
                        <PanelRightOpen size={18} />
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
                        Chưa có tin nhắn. Hãy gửi tin nhắn đầu tiên.
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
                                {getAvatarText(mine ? currentUser?.name : selectedUser.name)}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xs font-semibold text-slate-200">
                                    {mine ? "Bạn" : selectedUser.name}
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
                                <p className="mt-0.5 whitespace-pre-wrap break-words text-sm leading-5 text-slate-300">{message.content}</p>
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
                      placeholder="Nhập tin nhắn..."
                      className="h-9 flex-1 rounded-md border border-white/8 bg-[#121824] px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500"
                    />

                    <button
                      type="submit"
                      className="flex h-9 w-9 items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-400"
                    >
                      <Send size={16} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center text-slate-500">
                  Chọn user để bắt đầu nhắn tin hoặc gọi video
                </div>
              )}
            </section>
          </Panel>

          <Separator className="hidden w-[3px] cursor-col-resize bg-slate-900 transition-colors hover:bg-blue-600 xl:block" />

          {showInfo && (
            <>
              <Panel
                defaultSize="300px"
                className="hidden bg-slate-900 xl:block"
              >
                <aside className="h-full border-l border-white/7">
                  <ContactInfoPanel user={selectedUser} onCall={handleStartCall} />
                  <div className="hidden">
                  {selectedUser ? (
                    <>
                      <div className="flex flex-col items-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-700 text-3xl font-bold text-white">
                          {getAvatarText(selectedUser.name)}
                        </div>

                        <h2 className="mt-4 text-center text-lg font-bold text-white">
                          {selectedUser.name}
                        </h2>

                        <p className="mt-1 text-center text-sm text-slate-400">
                          {selectedUser.email}
                        </p>

                        <button className="mt-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700">
                          <Search size={20} />
                        </button>

                        <p className="mt-2 text-sm text-slate-300">Tìm kiếm</p>
                      </div>

                      <div className="mt-8 space-y-4 font-semibold text-slate-200">
                        <button className="flex w-full justify-between hover:text-white">
                          File phương tiện và file
                          <span>⌄</span>
                        </button>

                        <button className="flex w-full justify-between hover:text-white">
                          Quyền riêng tư và hỗ trợ
                          <span>⌄</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-slate-400">
                      Chưa chọn user
                    </div>
                  )}
                  </div>
                </aside>
              </Panel>
            </>
          )}
        </Group>
      </main>

      <CreateGroupModal
        open={groupModalOpen}
        users={users}
        onClose={() => setGroupModalOpen(false)}
        onCreate={handleCreateGroup}
      />
    </>
  );
}

export default Home;
