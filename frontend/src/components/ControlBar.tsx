import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  LayoutGrid,
} from "lucide-react";
import type { LayoutMode } from "./VideoGrid";

type ControlBarProps = {
  joined: boolean;
  cameraEnabled: boolean;
  micEnabled: boolean;

  layoutMode: LayoutMode;
  onChangeLayout: () => void;

  onJoinRoom: () => void;
  onLeaveRoom: () => void | Promise<void>;
  onToggleCamera: () => void;
  onToggleMic: () => void;
};

function ControlBar({
  joined,
  cameraEnabled,
  micEnabled,
  layoutMode,
  onChangeLayout,
  onJoinRoom,
  onLeaveRoom,
  onToggleCamera,
  onToggleMic,
}: ControlBarProps) {
  const layoutLabel =
    layoutMode === "spotlight"
      ? "Spotlight"
      : layoutMode === "grid"
        ? "Grid"
        : "Sidebar";

  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-[#0d111b]/95 p-1.5 shadow-2xl backdrop-blur">
        {joined && (
          <>
            <button
              onClick={onToggleMic}
              className={`flex h-9 w-9 items-center justify-center rounded-md transition ${
                micEnabled
                  ? "bg-white/7 text-slate-200 hover:bg-white/12"
                  : "bg-red-500/15 text-red-300 hover:bg-red-500/25"
              }`}
              title={micEnabled ? "Tắt micro" : "Bật micro"}
            >
              {micEnabled ? <Mic size={17} /> : <MicOff size={17} />}
            </button>

            <button
              onClick={onToggleCamera}
              className={`flex h-9 w-9 items-center justify-center rounded-md transition ${
                cameraEnabled
                  ? "bg-white/7 text-slate-200 hover:bg-white/12"
                  : "bg-red-500/15 text-red-300 hover:bg-red-500/25"
              }`}
              title={cameraEnabled ? "Tắt camera" : "Bật camera"}
            >
              {cameraEnabled ? <Video size={17} /> : <VideoOff size={17} />}
            </button>

            <button
              onClick={onChangeLayout}
              className="flex h-9 w-9 items-center justify-center rounded-md bg-white/7 text-slate-200 transition hover:bg-white/12"
              title={`Đổi layout: ${layoutLabel}`}
            >
              <LayoutGrid size={17} />
            </button>
          </>
        )}

        {!joined ? (
          <button
            onClick={onJoinRoom}
            className="h-9 rounded-md bg-indigo-500 px-5 text-xs font-semibold text-white transition hover:bg-indigo-400"
          >
            Tham gia
          </button>
        ) : (
          <button
            onClick={onLeaveRoom}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-red-500/90 transition hover:bg-red-500"
            title="Rời phòng"
          >
            <PhoneOff size={17} />
          </button>
        )}
      </div>
    </div>
  );
}

export default ControlBar;
