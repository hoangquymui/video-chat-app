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
      <div className="flex items-center gap-3 rounded-full border border-slate-700/70 bg-slate-900/95 px-4 py-3 shadow-2xl backdrop-blur">
        {joined && (
          <>
            <button
              onClick={onToggleMic}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
                micEnabled
                  ? "bg-slate-700 hover:bg-slate-600"
                  : "bg-red-600 hover:bg-red-700"
              }`}
              title={micEnabled ? "Tắt micro" : "Bật micro"}
            >
              {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            <button
              onClick={onToggleCamera}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
                cameraEnabled
                  ? "bg-slate-700 hover:bg-slate-600"
                  : "bg-red-600 hover:bg-red-700"
              }`}
              title={cameraEnabled ? "Tắt camera" : "Bật camera"}
            >
              {cameraEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </button>

            <button
              onClick={onChangeLayout}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-700 transition hover:bg-slate-600"
              title={`Đổi layout: ${layoutLabel}`}
            >
              <LayoutGrid size={20} />
            </button>
          </>
        )}

        {!joined ? (
          <button
            onClick={onJoinRoom}
            className="rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Tham gia
          </button>
        ) : (
          <button
            onClick={onLeaveRoom}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 transition hover:bg-red-700"
            title="Rời phòng"
          >
            <PhoneOff size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

export default ControlBar;
