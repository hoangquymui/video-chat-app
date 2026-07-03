import { useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { useMeetingMedia } from "./useMeetingMedia";
import { usePeerManager } from "./usePeerManager";
import { useSocketSignaling } from "./useSocketSignaling";
import { useMeetingLifecycle } from "./useMeetingLifecycle";
import type { OnlineUser } from "../types/webrtc.type";
import { createFakeParticipants } from "../utils/fakeParticipants";

export function useWebRTC() {
  const { user } = useAuth();

  const meetingCodeRef = useRef<string | null>(null);
  const joinedRef = useRef(false);

  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  const {
    localVideoRef,
    localStreamRef,
    localStream,
    cameraEnabled,
    micEnabled,
    startLocalCamera,
    stopLocalCamera,
    toggleCamera,
    toggleMic,
  } = useMeetingMedia();

  const {
    remoteStreams,
    removePeer,
    cleanupPeers,
    handleUserJoined,
    handleOffer,
    handleAnswer,
    handleCandidate,
  } = usePeerManager({
    localStreamRef,
    meetingCodeRef,
  });

  const { registerSocketEvents, unregisterSocketEvents } = useSocketSignaling({
    onUserJoined: handleUserJoined,
    onOffer: handleOffer,
    onAnswer: handleAnswer,
    onCandidate: handleCandidate,
    onUserLeft: removePeer,
    onUsersChanged: setOnlineUsers,
  });

  const {
    activeCall,
    setActiveCall,
    joined,
    startMeetingPreview,
    joinRoom,
    leaveRoom,
    startMeeting,
    endCurrentMeeting,
  } = useMeetingLifecycle({
    user,
    meetingCodeRef,
    joinedRef,
    localStreamRef,
    startLocalCamera,
    stopLocalCamera,
    cleanupPeers,
    registerSocketEvents,
    unregisterSocketEvents,
    setOnlineUsers,
  });
  //-----------------------Fake users for testing-----------------------
  const DEBUG_FAKE_USERS = true;
  const displayRemoteStreams = DEBUG_FAKE_USERS
    ? createFakeParticipants(3)
    : remoteStreams;
  //-----------------------Fake users for testing-----------------------

  return {
    localVideoRef,
    localStream,
    //remoteStreams,
    remoteStreams: displayRemoteStreams,
    onlineUsers,

    joined,
    cameraEnabled,
    micEnabled,

    activeCall,
    setActiveCall,

    startMeeting,
    endCurrentMeeting,

    startMeetingPreview,
    joinRoom,
    leaveRoom,

    toggleCamera,
    toggleMic,
  };
}
