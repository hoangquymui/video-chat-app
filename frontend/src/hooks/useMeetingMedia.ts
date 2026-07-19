import { useRef, useState } from "react";
import { useAppDialog } from "../contexts/AppDialogContext";

export function useMeetingMedia() {
  const { notify } = useAppDialog();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);

  const startLocalCamera = async () => {
    if (localStreamRef.current) {
      return localStreamRef.current;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      await notify(
        "Trình duyệt không hỗ trợ camera/micro hoặc đang không chạy trên HTTPS/localhost.",
      );
      throw new Error("getUserMedia is not supported");
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasCamera = devices.some((device) => device.kind === "videoinput");

    if (!hasCamera) {
      await notify("Không tìm thấy camera trên thiết bị này.");
      throw new Error("No camera device found");
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (stream.getVideoTracks().length === 0) {
      stream.getTracks().forEach((track) => track.stop());
      await notify("Bạn đã cấp quyền nhưng hệ thống không nhận được camera.");
      throw new Error("Permission granted but no video track found");
    }

    localStreamRef.current = stream;
    setLocalStream(stream);

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    setCameraEnabled(true);
    setMicEnabled(stream.getAudioTracks().some((track) => track.enabled));

    return stream;
  };

  const stopLocalCamera = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    localStreamRef.current = null;
    setLocalStream(null);
    setCameraEnabled(false);
    setMicEnabled(false);
  };

  const toggleCamera = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;
    setCameraEnabled(videoTrack.enabled);
  };

  const toggleMic = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    setMicEnabled(audioTrack.enabled);
  };

  return {
    localVideoRef,
    localStreamRef,
    localStream,
    cameraEnabled,
    micEnabled,
    startLocalCamera,
    stopLocalCamera,
    toggleCamera,
    toggleMic,
  };
}
