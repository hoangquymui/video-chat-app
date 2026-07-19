import { CalendarDays, Mail, PhoneCall, Search, ShieldCheck, UserRound } from "lucide-react";
import type { User } from "../types/user.type";

type ContactInfoPanelProps = {
  user: User | null;
  onCall: () => void;
};

export default function ContactInfoPanel({ user, onCall }: ContactInfoPanelProps) {
  if (!user) {
    return <div className="p-4 text-center text-xs text-slate-500">Chưa chọn liên hệ</div>;
  }

  return (
    <div className="flex h-full flex-col bg-[#0d111b]">
      <header className="border-b border-white/7 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Contact details</p>
        <h2 className="mt-1 text-sm font-semibold text-white">Thông tin liên hệ</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-500/15 text-sm font-bold text-indigo-300">
            {user.name.trim().charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white">{user.name}</h3>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Tài khoản hoạt động
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={onCall} className="flex h-8 items-center justify-center gap-2 rounded-md bg-indigo-500 text-xs font-medium text-white hover:bg-indigo-400">
            <PhoneCall size={14} /> Gọi
          </button>
          <button className="flex h-8 items-center justify-center gap-2 rounded-md border border-white/8 bg-white/4 text-xs text-slate-300 hover:bg-white/8">
            <Search size={14} /> Tìm tin
          </button>
        </div>

        <div className="mt-5 space-y-1">
          <Property icon={Mail} label="Email" value={user.email} />
          <Property icon={ShieldCheck} label="Vai trò" value={user.role === "admin" ? "Quản trị viên" : "Thành viên"} />
          <Property icon={CalendarDays} label="Ngày tham gia" value={new Date(user.createdAt).toLocaleDateString("vi-VN")} />
          <Property icon={UserRound} label="Mã người dùng" value={`#${user.id}`} />
        </div>
      </div>
    </div>
  );
}

type IconType = typeof Mail;

function Property({ icon: Icon, label, value }: { icon: IconType; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[26px_1fr] gap-2 rounded-md px-2 py-2 hover:bg-white/[0.025]">
      <div className="flex h-6 w-6 items-center justify-center rounded bg-white/5 text-slate-500"><Icon size={13} /></div>
      <div className="min-w-0"><p className="text-[10px] uppercase tracking-wider text-slate-600">{label}</p><p className="truncate text-xs text-slate-300">{value}</p></div>
    </div>
  );
}
