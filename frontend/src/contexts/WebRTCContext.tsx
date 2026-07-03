import { createContext, useContext, type ReactNode } from "react";
import { useWebRTC } from "../hooks/useWebRTC";

type WebRTCContextValue = ReturnType<typeof useWebRTC>;

const WebRTCContext = createContext<WebRTCContextValue | null>(null);

export function WebRTCProvider({ children }: { children: ReactNode }) {
  const value = useWebRTC();

  return (
    <WebRTCContext.Provider value={value}>{children}</WebRTCContext.Provider>
  );
}

export function useWebRTCContext() {
  const context = useContext(WebRTCContext);

  if (!context) {
    throw new Error("useWebRTCContext must be used inside WebRTCProvider");
  }

  return context;
}
