import { useEffect, useMemo, useState } from "react";
import { Info, MoreHorizontal, Pencil, Search, Video } from "lucide-react";
import { getChatUsersApi } from "../api/user.api";
import type { User } from "../types/user.type";

function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

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
      setSelectedUser(data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error(error);
      alert("Không tải được danh sách user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getAvatarText = (name?: string) => {
    return name?.trim().charAt(0).toUpperCase() || "?";
  };

  return (
    <main className="flex h-full bg-slate-950 text-white">
      <aside className="w-[360px] shrink-0 border-r border-slate-800 bg-slate-900">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Đoạn chat</h1>

            <div className="flex gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700">
                <MoreHorizontal size={20} />
              </button>

              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700">
                <Pencil size={20} />
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-slate-400">
            <Search size={18} />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm kiếm người dùng"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="mt-5 flex gap-4 text-sm font-semibold">
            <button className="rounded-full bg-blue-600 px-4 py-2 text-white">
              Tất cả
            </button>

            <button className="text-slate-400 hover:text-white">
              Đang hoạt động
            </button>

            <button className="text-slate-400 hover:text-white">Nhóm</button>
          </div>
        </div>

        <div className="h-[calc(100%-145px)] overflow-auto px-2">
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
                  onClick={() => setSelectedUser(user)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                    active ? "bg-slate-800" : "hover:bg-slate-800"
                  }`}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-700 text-lg font-bold text-white">
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

      <section className="flex min-w-0 flex-1 flex-col bg-slate-950">
        {selectedUser ? (
          <>
            <header className="flex h-[74px] shrink-0 items-center justify-between border-b border-slate-800 px-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-700 font-bold text-white">
                  {getAvatarText(selectedUser.name)}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate font-bold text-white">
                    {selectedUser.name}
                  </h2>
                  <p className="truncate text-sm text-slate-400">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 text-blue-500">
                <button className="rounded-full p-2 hover:bg-slate-800">
                  <Video size={22} />
                </button>

                <button className="rounded-full p-2 hover:bg-slate-800">
                  <Info size={22} />
                </button>
              </div>
            </header>

            <div className="flex flex-1 items-center justify-center text-slate-500">
              Chưa có nội dung chat. Bấm nút video để bắt đầu cuộc gọi.
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-slate-500">
            Chọn user để bắt đầu nhắn tin hoặc gọi video
          </div>
        )}
      </section>

      <aside className="hidden w-[320px] shrink-0 border-l border-slate-800 bg-slate-900 p-6 xl:block">
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
          <div className="text-center text-slate-400">Chưa chọn user</div>
        )}
      </aside>
    </main>
  );
}

export default Home;
