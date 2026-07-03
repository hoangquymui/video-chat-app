import { useCallback } from "react";
import { socket } from "../services/socket";
import type { OnlineUser, RemoteUser } from "../types/webrtc.type";

type Props = {
  onUserJoined: (peerId: string, user: RemoteUser) => Promise<void>;

  onOffer: (
    peerId: string,
    offer: RTCSessionDescriptionInit,
    user?: RemoteUser,
  ) => Promise<void>;

  onAnswer: (
    peerId: string,
    answer: RTCSessionDescriptionInit,
  ) => Promise<void>;

  onCandidate: (
    peerId: string,
    candidate: RTCIceCandidateInit,
  ) => Promise<void>;

  onUserLeft: (peerId: string) => void;

  onUsersChanged: (users: OnlineUser[]) => void;
};

export function useSocketSignaling({
  onUserJoined,
  onOffer,
  onAnswer,
  onCandidate,
  onUserLeft,
  onUsersChanged,
}: Props) {
  const unregisterSocketEvents = useCallback(() => {
    socket.off("user-joined");
    socket.off("offer");
    socket.off("answer");
    socket.off("candidate");
    socket.off("user-left");
    socket.off("call-users");
  }, []);

  const registerSocketEvents = useCallback(() => {
    unregisterSocketEvents();

    socket.on(
      "user-joined",
      async ({ from, user }: { from: string; user: RemoteUser }) => {
        await onUserJoined(from, user);
      },
    );

    socket.on(
      "offer",
      async ({
        from,
        offer,
        user,
      }: {
        from: string;
        offer: RTCSessionDescriptionInit;
        user?: RemoteUser;
      }) => {
        await onOffer(from, offer, user);
      },
    );

    socket.on(
      "answer",
      async ({
        from,
        answer,
      }: {
        from: string;
        answer: RTCSessionDescriptionInit;
      }) => {
        await onAnswer(from, answer);
      },
    );

    socket.on(
      "candidate",
      async ({
        from,
        candidate,
      }: {
        from: string;
        candidate: RTCIceCandidateInit;
      }) => {
        await onCandidate(from, candidate);
      },
    );

    socket.on("user-left", ({ from }: { from: string }) => {
      onUserLeft(from);
    });

    socket.on("call-users", ({ users }: { users: OnlineUser[] }) => {
      onUsersChanged(users);
    });
  }, [
    onAnswer,
    onCandidate,
    onOffer,
    onUserJoined,
    onUserLeft,
    onUsersChanged,
    unregisterSocketEvents,
  ]);

  return {
    registerSocketEvents,
    unregisterSocketEvents,
  };
}
