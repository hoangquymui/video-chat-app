import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ActiveMeetingProvider } from "./contexts/ActiveMeetingContext";
import { WebRTCProvider } from "./contexts/WebRTCContext";
import "./index.css";
import App from "./App";
import { AppDialogProvider } from "./contexts/AppDialogContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppDialogProvider>
          <ActiveMeetingProvider>
            <WebRTCProvider>
              <App />
            </WebRTCProvider>
          </ActiveMeetingProvider>
        </AppDialogProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
