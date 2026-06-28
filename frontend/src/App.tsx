import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Call from "./pages/Call";
import AdminUsers from "./pages/AdminUsers";
import Admin from "./pages/Admin";
import AdminGroups from "./pages/AdminGroups";
import AppLayout from "./components/AppLayout";
import Rooms from "./pages/Rooms";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { isLoggedIn, user } = useAuth();

  const isAdmin = user?.role === "admin";

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />
        }
      />

      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/home" /> : <Login />}
      />

      <Route element={isLoggedIn ? <AppLayout /> : <Navigate to="/login" />}>
        <Route path="/home" element={<Home />} />
        <Route path="/call" element={<Call />} />
        <Route path="/call/:roomId" element={<Call />} />
        <Route path="/rooms" element={<Rooms />} />

        <Route
          path="/admin"
          element={isAdmin ? <Admin /> : <Navigate to="/home" />}
        />

        <Route
          path="/admin/users"
          element={isAdmin ? <AdminUsers /> : <Navigate to="/home" />}
        />

        <Route
          path="/admin/groups"
          element={isAdmin ? <AdminGroups /> : <Navigate to="/home" />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
