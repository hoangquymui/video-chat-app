export type MeetingStatus = "active" | "ended";

export type Meeting = {
  id: number;
  roomId: number;
  meetingCode: string;
  startedBy: number;
  status: MeetingStatus;
  startedAt: string;
  endedAt: string | null;
};

export type CreateMeetingData = {
  roomId: number;
};
