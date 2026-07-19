import { useEffect, useRef, useState } from "react";
import { useAppDialog } from "../contexts/AppDialogContext";

export function useCamera() {
  const { notify } = useAppDialog();
  const videoRef1 = useRef<HTMLVideoElement | null>(null);
  const videoRef2 = useRef<HTMLVideoElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);

      if (videoRef1.current) {
        videoRef1.current.srcObject = mediaStream;
      }

      if (videoRef2.current) {
        videoRef2.current.srcObject = mediaStream;
      }

      setCameraOn(true);
    } catch {
      await notify("Không mở được camera hoặc micro");
    }
  };

  const stopCamera = () => {
    if (!stream) return;

    stream.getTracks().forEach((track) => track.stop());

    if (videoRef1.current) {
      videoRef1.current.srcObject = null;
    }

    if (videoRef2.current) {
      videoRef2.current.srcObject = null;
    }

    setStream(null);
    setCameraOn(false);
  };

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  return {
    videoRef1,
    videoRef2,
    cameraOn,
    startCamera,
    stopCamera,
  };
}
