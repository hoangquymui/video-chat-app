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

type FormMode = "create" | "edit";

function AdminUsers() {
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
    const confirmed = confirm(
      `Bạn có chắc muốn xoá user "${user.name}" không?`,
    );

    if (!confirmed) return;

    try {
      await deleteUserApi(user.id);
      await loadUsers();
    } catch (error) {
      console.error(error);
      alert("Xoá user thất bại");
    }
  };

  return (
    <main className="min-h-full px-8 py-8">
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
              <h1 className="text-3xl font-bold text-white">Quản lý user</h1>
              <p className="mt-1 text-slate-400">
                Thêm, sửa, xoá tài khoản trong hệ thống.
              </p>
            </div>
          </div>

          <button
            onClick={openCreateForm}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
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
