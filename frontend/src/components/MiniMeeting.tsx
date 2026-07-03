import { Maximize2, PhoneOff, Video } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useActiveMeeting } from "../contexts/ActiveMeetingContext";

function MiniMeeting() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeMeeting, setActiveMeeting } = useActiveMeeting();

  if (!activeMeeting) return null;

  const isInMeetingPage =
    location.pathname === `/meeting/${activeMeeting.meetingCode}`;

  if (isInMeetingPage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] w-[260px] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl">
      <div className="flex aspect-video items-center justify-center bg-black">
        <Video size={42} className="text-slate-500" />
      </div>

      <div className="p-3">
        <p className="truncate text-sm font-semibold">Đang trong cuộc gọi</p>

        <p className="mt-1 truncate text-xs text-slate-400">
          {activeMeeting.title}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => navigate(`/meeting/${activeMeeting.meetingCode}`)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold hover:bg-blue-700"
          >
            <Maximize2 size={16} />
            Quay lại
          </button>

          <button
            onClick={() => setActiveMeeting(null)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 hover:bg-red-700"
            title="Ẩn mini meeting"
          >
            <PhoneOff size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MiniMeeting;
