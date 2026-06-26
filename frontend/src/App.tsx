import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import AdminUsers from "./pages/AdminUsers";
import AppLayout from "./components/AppLayout";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

function App() {
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");

  const isAdmin = user?.role === "admin";

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />

      <Route path="/login" element={<Login />} />

      <Route element={isLoggedIn ? <AppLayout /> : <Navigate to="/login" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room" element={<Home />} />

        <Route
          path="/admin/users"
          element={isAdmin ? <AdminUsers /> : <Navigate to="/dashboard" />}
        />
      </Route>
    </Routes>
  );
}

export default App;
