import ParticipantCard from "../ParticipantCard";
import ControlBar from "../ControlBar";
import type { LayoutMode, Participant } from "../VideoGrid";

type SidebarLayoutProps = {
  pinnedParticipant: Participant;
  otherParticipants: Participant[];

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

function SidebarLayout({
  pinnedParticipant,
  otherParticipants,
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
}: SidebarLayoutProps) {
  return (
    <section className="flex h-full min-h-0 gap-3">
      <div className="relative flex min-w-0 flex-1 items-stretch justify-center">
        <div className="h-full w-full overflow-hidden rounded-2xl px-10 pt-4 pb-14">
          <ParticipantCard
            title={pinnedParticipant.title}
            stream={pinnedParticipant.stream}
            muted={pinnedParticipant.isLocal}
            active
          />
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
      </div>

      {otherParticipants.length > 0 && (
        <aside className="custom-scrollbar flex w-[190px] shrink-0 flex-col gap-2 overflow-y-auto rounded-xl border border-slate-800/80 bg-slate-900/60 p-2">
          {otherParticipants.map((participant) => (
            <div
              key={participant.id}
              className="shrink-0 rounded-xl p-1 transition hover:scale-[1.02]"
            >
              <ParticipantCard
                title={participant.title}
                stream={participant.stream}
                muted={participant.isLocal}
                small
                onClick={() => onPin(participant.id)}
              />
            </div>
          ))}
        </aside>
      )}
    </section>
  );
}

export default SidebarLayout;
