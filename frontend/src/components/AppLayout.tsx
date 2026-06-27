import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  House,
  LogOut,
  Menu,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

function AppLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="flex h-screen overflow-hidden bg-slate-950 text-white">
      <aside
        className={`flex h-full flex-col overflow-hidden border-r border-slate-800 bg-slate-900 px-3 py-4 transition-all duration-150 ease-out ${
          collapsed ? "w-[72px]" : "w-[180px]"
        }`}
      >
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="mb-6 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 transition-colors hover:bg-slate-700"
          title={collapsed ? "Mở menu" : "Thu gọn menu"}
        >
          <Menu size={21} />
        </button>

        <div
          className={`overflow-hidden transition-all duration-150 ease-out ${
            collapsed ? "h-0 opacity-0" : "h-14 opacity-100"
          }`}
        >
          <h1 className="truncate text-xl font-bold">Video Call</h1>
          <p className="mt-1 truncate text-sm text-slate-400">{user?.name}</p>
        </div>

        <nav className="mt-8 flex flex-col gap-2">
          <NavItem
            collapsed={collapsed}
            to="/home"
            icon={House}
            label="Đoạn chat"
          />

          <NavItem
            collapsed={collapsed}
            to="/call"
            icon={Video}
            label="Phòng gọi"
          />

          {user?.role === "admin" && (
            <NavItem
              collapsed={collapsed}
              to="/admin/users"
              icon={Users}
              label="Quản lý user"
            />
          )}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex h-11 shrink-0 items-center overflow-hidden rounded-xl bg-red-600 font-semibold transition-colors hover:bg-red-700"
          title="Đăng xuất"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center">
            <LogOut size={20} />
          </div>

          <div
            className={`overflow-hidden transition-all duration-150 ease-out ${
              collapsed ? "w-0 opacity-0" : "w-32 opacity-100"
            }`}
          >
            <span className="whitespace-nowrap">Đăng xuất</span>
          </div>
        </button>
      </aside>

      <section className="h-full flex-1 overflow-hidden bg-slate-950">
        <Outlet />
      </section>
    </main>
  );
}

type NavItemProps = {
  collapsed: boolean;
  to: string;
  icon: LucideIcon;
  label: string;
};

function NavItem({ collapsed, to, icon: Icon, label }: NavItemProps) {
  return (
    <Link
      to={to}
      title={label}
      className="flex h-11 items-center overflow-hidden rounded-xl text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center">
        <Icon size={20} />
      </div>

      <div
        className={`overflow-hidden transition-all duration-150 ease-out ${
          collapsed ? "w-0 opacity-0" : "w-40 opacity-100"
        }`}
      >
        <span className="whitespace-nowrap">{label}</span>
      </div>
    </Link>
  );
}

export default AppLayout;
