import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Menu, House, Video, Users, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

function AppLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <main className="flex h-screen overflow-hidden bg-slate-950 text-white">
      <aside
        className={`flex h-full flex-col overflow-hidden border-r border-slate-800 bg-slate-900 py-4 transition-all duration-150 ease-out ${
          collapsed ? "w-[70px] items-center px-0" : "w-[280px] px-3"
        }`}
      >
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className={`mb-6 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-xl transition-all hover:bg-slate-700 ${
            collapsed ? "self-center" : ""
          }`}
        >
          ☰
        </button>

        <nav
          className={`mt-8 flex flex-col gap-2 ${
            collapsed ? "items-center" : ""
          }`}
        >
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
          className={`mt-auto flex h-11 items-center justify-center rounded-xl bg-red-600 font-semibold transition-all hover:bg-red-700 ${
            collapsed ? "w-11 text-xl" : "w-full"
          }`}
        >
          {collapsed ? "⏻" : "Đăng xuất"}
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
      className={`flex h-11 items-center rounded-xl text-slate-300 transition-all hover:bg-slate-800 hover:text-white ${
        collapsed ? "w-11 justify-center" : "w-full px-4"
      }`}
    >
      <Icon size={20} className="shrink-0" />

      {!collapsed && <span className="ml-3 whitespace-nowrap">{label}</span>}
    </Link>
  );
}

export default AppLayout;
