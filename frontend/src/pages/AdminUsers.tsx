import { useEffect, useState } from "react";
import {
  createUserApi,
  deleteUserApi,
  getUsersApi,
  updateUserApi,
} from "../api/user.api";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";
import type { CreateUserData, UpdateUserData, User } from "../types/user.type";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDialog } from "../contexts/AppDialogContext";

type FormMode = "create" | "edit";

function AdminUsers() {
  const { confirmAction, notify } = useAppDialog();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersApi();
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateForm = () => {
    setFormMode("create");
    setSelectedUser(null);
    setFormOpen(true);
  };

  const openEditForm = (user: User) => {
    setFormMode("edit");
    setSelectedUser(user);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (data: CreateUserData | UpdateUserData) => {
    if (formMode === "create") {
      await createUserApi(data as CreateUserData);
    } else {
      if (!selectedUser) return;
      await updateUserApi(selectedUser.id, data as UpdateUserData);
    }

    await loadUsers();
  };

  const handleDelete = async (user: User) => {
    const confirmed = await confirmAction({
      title: "Xoá tài khoản",
      message: `Bạn có chắc muốn xoá user “${user.name}” không?`,
      confirmLabel: "Có, xoá user",
      tone: "danger",
    });

    if (!confirmed) return;

    try {
      await deleteUserApi(user.id);
      await loadUsers();
    } catch {
      await notify({ message: "Xoá user thất bại", tone: "danger" });
    }
  };

  return (
    <main className="min-h-full bg-[#090d15] px-5 py-5">
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
              <h1 className="text-3xl font-bold text-white">Quản lý user</h1>
              <p className="mt-0.5 text-xs text-slate-400">
                Thêm, sửa, xoá tài khoản trong hệ thống.
              </p>
            </div>
          </div>

          <button
            onClick={openCreateForm}
            className="h-9 rounded-lg bg-indigo-500 px-4 text-xs font-semibold text-white transition hover:bg-indigo-400"
          >
            + Thêm user
          </button>
        </div>

        <UserTable
          users={users}
          loading={loading}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      </div>

      <UserForm
        open={formOpen}
        mode={formMode}
        user={selectedUser}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />
    </main>
  );
}

export default AdminUsers;
