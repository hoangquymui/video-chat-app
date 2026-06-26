import { useRef, useState } from "react";
import { socket } from "../services/socket";

type RemoteStream = {
  peerId: string;
  stream: MediaStream;
};

const ROOM_ID = "test-room";

export function useWebRTC() {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());

  const [joined, setJoined] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);

  const startLocalCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    return stream;
  };

  const removePeer = (remotePeerId: string) => {
    const peer = peerConnectionsRef.current.get(remotePeerId);

    if (peer) {
      peer.close();
      peerConnectionsRef.current.delete(remotePeerId);
    }

    setRemoteStreams((prev) =>
      prev.filter((item) => item.peerId !== remotePeerId),
    );
  };

  const createPeerConnection = (remotePeerId: string) => {
    const oldPeer = peerConnectionsRef.current.get(remotePeerId);

    if (oldPeer) {
      return oldPeer;
    }

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    localStreamRef.current?.getTracks().forEach((track) => {
      peer.addTrack(track, localStreamRef.current!);
    });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", {
          roomId: ROOM_ID,
          to: remotePeerId,
          candidate: event.candidate.toJSON(),
        });
      }
    };

    peer.ontrack = (event) => {
      const [stream] = event.streams;

      setRemoteStreams((prev) => {
        const existed = prev.some((item) => item.peerId === remotePeerId);

        if (existed) {
          return prev.map((item) =>
            item.peerId === remotePeerId
              ? { peerId: remotePeerId, stream }
              : item,
          );
        }

        return [...prev, { peerId: remotePeerId, stream }];
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
  };

  const handleUserJoined = async (remotePeerId: string) => {
    const peer = createPeerConnection(remotePeerId);

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.emit("offer", {
      roomId: ROOM_ID,
      to: remotePeerId,
      offer,
    });
  };

  const handleOffer = async (
    remotePeerId: string,
    offer: RTCSessionDescriptionInit,
  ) => {
    const peer = createPeerConnection(remotePeerId);

    await peer.setRemoteDescription(offer);

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("answer", {
      roomId: ROOM_ID,
      to: remotePeerId,
      answer,
    });
  };

  const handleAnswer = async (
    remotePeerId: string,
    answer: RTCSessionDescriptionInit,
  ) => {
    const peer = peerConnectionsRef.current.get(remotePeerId);

    if (!peer) return;

    await peer.setRemoteDescription(answer);
  };

  const handleCandidate = async (
    remotePeerId: string,
    candidate: RTCIceCandidateInit,
  ) => {
    const peer = peerConnectionsRef.current.get(remotePeerId);

    if (!peer) return;

    try {
      await peer.addIceCandidate(candidate);
    } catch (error) {
      console.error("Lỗi ICE candidate:", error);
    }
  };

  const registerSocketEvents = () => {
    socket.on("user-joined", async ({ from }: { from: string }) => {
      await handleUserJoined(from);
    });

    socket.on(
      "offer",
      async ({
        from,
        offer,
      }: {
        from: string;
        offer: RTCSessionDescriptionInit;
      }) => {
        await handleOffer(from, offer);
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
        await handleAnswer(from, answer);
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
        await handleCandidate(from, candidate);
      },
    );

    socket.on("user-left", ({ from }: { from: string }) => {
      removePeer(from);
    });
  };

  const unregisterSocketEvents = () => {
    socket.off("user-joined");
    socket.off("offer");
    socket.off("answer");
    socket.off("candidate");
    socket.off("user-left");
  };

  const joinRoom = async () => {
    await startLocalCamera();

    if (!socket.connected) {
      socket.connect();
    }

    registerSocketEvents();

    socket.emit("join-room", {
      roomId: ROOM_ID,
    });

    setJoined(true);
  };

  const leaveRoom = () => {
    socket.emit("leave-room", {
      roomId: ROOM_ID,
    });

    unregisterSocketEvents();

    peerConnectionsRef.current.forEach((peer) => {
      peer.close();
    });

    peerConnectionsRef.current.clear();

    localStreamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    localStreamRef.current = null;

    setRemoteStreams([]);
    setJoined(false);
  };

  return {
    localVideoRef,
    remoteStreams,
    joined,
    joinRoom,
    leaveRoom,
  };
}
