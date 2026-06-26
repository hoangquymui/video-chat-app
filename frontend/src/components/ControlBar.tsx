type ControlBarProps = {
  joined: boolean;
  cameraEnabled: boolean;
  micEnabled: boolean;
  onJoinRoom: () => void;
  onLeaveRoom: () => void;
  onToggleCamera: () => void;
  onToggleMic: () => void;
};

function ControlBar({
  joined,
  cameraEnabled,
  micEnabled,
  onJoinRoom,
  onLeaveRoom,
  onToggleCamera,
  onToggleMic,
}: ControlBarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-4 rounded-2xl bg-slate-800/90 px-6 py-4 shadow-2xl backdrop-blur">
        {joined && (
          <>
            <button
              onClick={onToggleMic}
              className={`rounded-full px-5 py-3 font-semibold text-white ${
                micEnabled
                  ? "bg-slate-600 hover:bg-slate-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {micEnabled ? "Tắt mic" : "Bật mic"}
            </button>

            <button
              onClick={onToggleCamera}
              className={`rounded-full px-5 py-3 font-semibold text-white ${
                cameraEnabled
                  ? "bg-slate-600 hover:bg-slate-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {cameraEnabled ? "Tắt camera" : "Bật camera"}
            </button>
          </>
        )}

        {!joined ? (
          <button
            onClick={onJoinRoom}
            className="rounded-full bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            Tham gia
          </button>
        ) : (
          <button
            onClick={onLeaveRoom}
            className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            Rời phòng
          </button>
        )}
      </div>
    </div>
  );
}

export default ControlBar;
