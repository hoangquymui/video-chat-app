import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Call from "./pages/Call";
import AdminUsers from "./pages/AdminUsers";
import AppLayout from "./components/AppLayout";
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
        <Route path="/room" element={<Navigate to="/call" />} />

        <Route
          path="/admin/users"
          element={isAdmin ? <AdminUsers /> : <Navigate to="/home" />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
