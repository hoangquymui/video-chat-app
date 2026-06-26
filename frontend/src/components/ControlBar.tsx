type ControlBarProps = {
  cameraOn: boolean;
  onStartCamera: () => void;
  onStopCamera: () => void;
};

function ControlBar({
  cameraOn,
  onStartCamera,
  onStopCamera,
}: ControlBarProps) {
  return (
    <div className="mt-8 flex justify-center">
      {!cameraOn ? (
        <button
          onClick={onStartCamera}
          className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
        >
          Bật camera
        </button>
      ) : (
        <button
          onClick={onStopCamera}
          className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
        >
          Tắt camera
        </button>
      )}
    </div>
  );
}

export default ControlBar;
