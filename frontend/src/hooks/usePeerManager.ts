import { useCallback, useRef, useState } from "react";
import { socket } from "../services/socket";
import type { RemoteStream, RemoteUser } from "../types/webrtc.type";

type UsePeerManagerParams = {
  localStreamRef: React.RefObject<MediaStream | null>;
  meetingCodeRef: React.RefObject<string | null>;
};

export function usePeerManager({
  localStreamRef,
  meetingCodeRef,
}: UsePeerManagerParams) {
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const remoteUsersRef = useRef<Map<string, RemoteUser>>(new Map());

  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);

  const removePeer = useCallback((remotePeerId: string) => {
    const peer = peerConnectionsRef.current.get(remotePeerId);

    if (peer) {
      peer.close();
      peerConnectionsRef.current.delete(remotePeerId);
    }

    remoteUsersRef.current.delete(remotePeerId);

    setRemoteStreams((prev) =>
      prev.filter((item) => item.peerId !== remotePeerId),
    );
  }, []);

  const cleanupPeers = useCallback(() => {
    peerConnectionsRef.current.forEach((peer) => peer.close());
    peerConnectionsRef.current.clear();
    remoteUsersRef.current.clear();
    setRemoteStreams([]);
  }, []);

  const createPeerConnection = useCallback(
    (remotePeerId: string) => {
      const oldPeer = peerConnectionsRef.current.get(remotePeerId);
      if (oldPeer) return oldPeer;

      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      localStreamRef.current?.getTracks().forEach((track) => {
        peer.addTrack(track, localStreamRef.current!);
      });

      peer.onicecandidate = (event) => {
        const meetingCode = meetingCodeRef.current;
        if (!event.candidate || !meetingCode) return;

        socket.emit("candidate", {
          meetingCode,
          to: remotePeerId,
          candidate: event.candidate.toJSON(),
        });
      };

      peer.ontrack = (event) => {
        const [stream] = event.streams;
        const remoteUser = remoteUsersRef.current.get(remotePeerId);

        setRemoteStreams((prev) => {
          const existed = prev.some((item) => item.peerId === remotePeerId);

          if (existed) {
            return prev.map((item) =>
              item.peerId === remotePeerId
                ? {
                    ...item,
                    name: remoteUser?.name ?? item.name,
                    stream,
                  }
                : item,
            );
          }

          return [
            ...prev,
            {
              peerId: remotePeerId,
              name: remoteUser?.name ?? "Người dùng",
              stream,
            },
          ];
        });
      };

      peer.onconnectionstatechange = () => {
        if (
          peer.connectionState === "disconnected" ||
          peer.connectionState === "failed" ||
          peer.connectionState === "closed"
        ) {
          removePeer(remotePeerId);
        }
      };

      peerConnectionsRef.current.set(remotePeerId, peer);

      return peer;
    },
    [localStreamRef, meetingCodeRef, removePeer],
  );

  const handleUserJoined = useCallback(
    async (remotePeerId: string, remoteUser: RemoteUser) => {
      const meetingCode = meetingCodeRef.current;
      if (!meetingCode) return;

      remoteUsersRef.current.set(remotePeerId, remoteUser);

      const peer = createPeerConnection(remotePeerId);

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socket.emit("offer", {
        meetingCode,
        to: remotePeerId,
        offer,
      });
    },
    [createPeerConnection, meetingCodeRef],
  );

  const handleOffer = useCallback(
    async (
      remotePeerId: string,
      offer: RTCSessionDescriptionInit,
      remoteUser?: RemoteUser,
    ) => {
      const meetingCode = meetingCodeRef.current;
      if (!meetingCode) return;

      if (remoteUser) {
        remoteUsersRef.current.set(remotePeerId, remoteUser);
      }

      const peer = createPeerConnection(remotePeerId);

      await peer.setRemoteDescription(offer);

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit("answer", {
        meetingCode,
        to: remotePeerId,
        answer,
      });
    },
    [createPeerConnection, meetingCodeRef],
  );

  const handleAnswer = useCallback(
    async (remotePeerId: string, answer: RTCSessionDescriptionInit) => {
      const peer = peerConnectionsRef.current.get(remotePeerId);
      if (!peer) return;

      await peer.setRemoteDescription(answer);
    },
    [],
  );

  const handleCandidate = useCallback(
    async (remotePeerId: string, candidate: RTCIceCandidateInit) => {
      const peer = peerConnectionsRef.current.get(remotePeerId);
      if (!peer) return;

      try {
        await peer.addIceCandidate(candidate);
      } catch (error) {
        console.error("Lỗi ICE candidate:", error);
      }
    },
    [],
  );

  return {
    remoteStreams,
    removePeer,
    cleanupPeers,
    handleUserJoined,
    handleOffer,
    handleAnswer,
    handleCandidate,
  };
}
