import ParticipantCard from "../ParticipantCard";
import ControlBar from "../ControlBar";
import type { LayoutMode, Participant } from "../VideoGrid";

type GridLayoutProps = {
  participants: Participant[];

  joined: boolean;
  cameraEnabled: boolean;
  micEnabled: boolean;

  layoutMode: LayoutMode;
  onChangeLayout: () => void;

  onJoinRoom: () => void;
  onLeaveRoom: () => void | Promise<void>;
  onToggleCamera: () => void;
  onToggleMic: () => void;

  onPin: (id: string) => void;
};

function GridLayout({
  participants,
  joined,
  cameraEnabled,
  micEnabled,
  layoutMode,
  onChangeLayout,
  onJoinRoom,
  onLeaveRoom,
  onToggleCamera,
  onToggleMic,
  onPin,
}: GridLayoutProps) {
  const gridClass =
    participants.length <= 1
      ? "grid-cols-1"
      : participants.length <= 4
        ? "grid-cols-2"
        : participants.length <= 9
          ? "grid-cols-3"
          : "grid-cols-4";

  const rowHeight =
    participants.length <= 4
      ? "auto-rows-[350px]"
      : participants.length <= 9
        ? "auto-rows-[230px]"
        : "auto-rows-[200px]";

  return (
    <section className="relative flex h-full min-h-0 flex-col">
      <div className="relative min-h-0 flex-1">
        <div
          className={`custom-scrollbar grid h-full ${rowHeight} gap-3 overflow-y-auto p-3 ${gridClass}`}
        >
          {participants.map((participant) => (
            <div key={participant.id} className="overflow-hidden rounded-xl">
              <ParticipantCard
                title={participant.title}
                stream={participant.stream}
                muted={participant.isLocal}
                onClick={() => onPin(participant.id)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
        <ControlBar
          joined={joined}
          cameraEnabled={cameraEnabled}
          micEnabled={micEnabled}
          layoutMode={layoutMode}
          onChangeLayout={onChangeLayout}
          onJoinRoom={onJoinRoom}
          onLeaveRoom={onLeaveRoom}
          onToggleCamera={onToggleCamera}
          onToggleMic={onToggleMic}
        />
      </div>
    </section>
  );
}

export default GridLayout;
