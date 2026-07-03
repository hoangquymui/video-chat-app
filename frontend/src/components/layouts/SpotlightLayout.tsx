import ParticipantCard from "../ParticipantCard";
import ControlBar from "../ControlBar";
import type { Participant, LayoutMode } from "../VideoGrid";

type SpotlightLayoutProps = {
  participants: Participant[];
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

function SpotlightLayout({
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
}: SpotlightLayoutProps) {
  return (
    <section className="flex h-full min-h-0 flex-col gap-2">
      {otherParticipants.length > 0 && (
        <div className="shrink-0 rounded-xl border border-slate-800/80 bg-slate-900/60 p-2">
          <div className="custom-scrollbar flex gap-2 overflow-x-auto overflow-y-hidden pb-1">
            {otherParticipants.map((participant) => (
              <div
                key={participant.id}
                className="w-[150px] shrink-0 rounded-xl p-1 transition hover:scale-[1.02]"
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
          </div>
        </div>
      )}

      <div className="relative flex min-h-0 flex-1 items-stretch justify-center">
        <div className="h-full w-full max-w-6xl overflow-hidden rounded-2xl px-15 pt-5 pb-15">
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
    </section>
  );
}

export default SpotlightLayout;
