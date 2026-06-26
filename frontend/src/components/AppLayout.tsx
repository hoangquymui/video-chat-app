import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  House,
  LogOut,
  Menu,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

function AppLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);

  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <main className="flex h-screen overflow-hidden bg-slate-950 text-white">
      <aside
        className={`flex h-full flex-col overflow-hidden border-r border-slate-800 bg-slate-900 px-3 py-4 transition-all duration-150 ease-out ${
          collapsed ? "w-[72px]" : "w-[280px]"
        }`}
      >
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="mb-6 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 transition-colors hover:bg-slate-700"
          title={collapsed ? "Mở menu" : "Thu gọn menu"}
        >
          <Menu size={21} />
        </button>

        <nav className="mt-8 flex flex-col gap-2">
          <NavItem
            collapsed={collapsed}
            to="/dashboard"
            icon={House}
            label="Dashboard"
          />

          <NavItem
            collapsed={collapsed}
            to="/room"
            icon={Video}
            label="Phòng họp"
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

      <section className="h-full flex-1 overflow-auto bg-slate-950">
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
