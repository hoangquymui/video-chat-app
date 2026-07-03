import type { RemoteStream } from "../types/webrtc.type";

export function createFakeParticipants(count: number): RemoteStream[] {
  return Array.from({ length: count }, (_, index) => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 100px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText(String(index + 1), canvas.width / 2, canvas.height / 2);
    }

    return {
      peerId: `fake-${index}`,
      name: `User ${index + 1}`,
      stream: canvas.captureStream(1),
    };
  });
}
