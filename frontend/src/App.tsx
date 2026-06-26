import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

function App() {
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />

      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
      />

      <Route
        path="/room"
        element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
