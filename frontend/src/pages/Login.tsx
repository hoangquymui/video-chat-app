import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("mui@gm.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      await login({ email, password });
    } catch (error) {
      console.error(error);
      setError("Email hoặc mật khẩu không đúng");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-2xl"
      >
        <h1 className="text-center text-3xl font-bold text-white">Đăng nhập</h1>

        <p className="mt-2 text-center text-slate-400">Video Call App</p>

        <div className="mt-8">
          <label className="text-sm font-medium text-slate-300">Email</label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="mt-5">
          <label className="text-sm font-medium text-slate-300">Mật khẩu</label>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-8 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Đăng nhập
        </button>
      </form>
    </main>
  );
}

export default Login;
