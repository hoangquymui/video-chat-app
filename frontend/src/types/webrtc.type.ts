export type RemoteUser = {
  id: number;
  name: string;
};

export type RemoteStream = {
  peerId: string;
  name: string;
  stream: MediaStream;
};

export type OnlineUser = {
  id: number;
  name: string;
};
