import { createContext, useContext, useState, type ReactNode } from "react";

type ActiveMeeting = {
  meetingCode: string;
  roomId: number;
  title: string;
};

type ActiveMeetingContextValue = {
  activeMeeting: ActiveMeeting | null;
  setActiveMeeting: (meeting: ActiveMeeting | null) => void;
};

const ActiveMeetingContext = createContext<ActiveMeetingContextValue | null>(
  null,
);

export function ActiveMeetingProvider({ children }: { children: ReactNode }) {
  const [activeMeeting, setActiveMeeting] = useState<ActiveMeeting | null>(
    null,
  );

  return (
    <ActiveMeetingContext.Provider
      value={{
        activeMeeting,
        setActiveMeeting,
      }}
    >
      {children}
    </ActiveMeetingContext.Provider>
  );
}

export function useActiveMeeting() {
  const context = useContext(ActiveMeetingContext);

  if (!context) {
    throw new Error(
      "useActiveMeeting must be used inside ActiveMeetingProvider",
    );
  }

  return context;
}
