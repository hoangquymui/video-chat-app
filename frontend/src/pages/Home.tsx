import Header from "../components/Header";
import VideoCard from "../components/VideoCard";
import RemoteVideoCard from "../components/RemoteVideoCard";
import { useWebRTC } from "../hooks/useWebRTC";

function Home() {
  const { localVideoRef, remoteStreams, joined, joinRoom, leaveRoom } =
    useWebRTC();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8">
      <Header />

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
        <VideoCard title="Camera của tôi" videoRef={localVideoRef} />

        {remoteStreams.map((remote, index) => (
          <RemoteVideoCard
            key={remote.peerId}
            title={`Camera tab ${index + 1}`}
            stream={remote.stream}
          />
        ))}
      </section>

      <div className="mt-8 flex justify-center gap-4">
        {!joined ? (
          <button
            onClick={joinRoom}
            className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            Tham gia phòng
          </button>
        ) : (
          <button
            onClick={leaveRoom}
            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            Rời phòng
          </button>
        )}
      </div>

      <p className="mt-4 text-center text-slate-400">
        Số tab đang kết nối: {remoteStreams.length}
      </p>
    </main>
  );
}

export default Home;
