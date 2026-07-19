import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import MiniMeeting from "./MiniMeeting";
import {
  House,
  LogOut,
  Menu,
  Video,
  Shield,
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
    <>
      <MiniMeeting />
      <main className="flex h-screen overflow-hidden bg-[#080b12] text-slate-100">
        <aside
          className={`flex h-full flex-col overflow-hidden border-r border-white/7 bg-[#0d111b] px-2.5 py-3 transition-all duration-200 ease-out ${
            collapsed ? "w-[60px]" : "w-[156px]"
          }`}
        >
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="mb-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/6 bg-white/5 transition-colors hover:bg-white/10"
            title={collapsed ? "Mở menu" : "Thu gọn menu"}
          >
            <Menu size={17} />
          </button>

          <div
            className={`overflow-hidden transition-all duration-150 ease-out ${
              collapsed ? "h-0 opacity-0" : "h-11 opacity-100"
            }`}
          >
            <h1 className="truncate text-sm font-bold tracking-wide">VIDA</h1>
            <p className="mt-0.5 truncate text-xs text-slate-500">{user?.name}</p>
          </div>

          <nav className="mt-5 flex flex-col gap-1.5">
            <NavItem
              collapsed={collapsed}
              to="/home"
              icon={House}
              label="Chat"
            />

            <NavItem
              collapsed={collapsed}
              to="/rooms"
              icon={Video}
              label="Phòng họp"
            />

            {user?.role === "admin" && (
              <NavItem
                collapsed={collapsed}
                to="/admin"
                icon={Shield}
                label="Admin"
              />
            )}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-auto flex h-9 shrink-0 items-center overflow-hidden rounded-lg border border-red-400/15 bg-red-500/10 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20"
            title="Đăng xuất"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center">
              <LogOut size={16} />
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
    </>
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
      className="flex h-9 items-center overflow-hidden rounded-lg text-xs font-medium text-slate-400 transition-colors hover:bg-white/6 hover:text-white"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center">
        <Icon size={16} />
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
