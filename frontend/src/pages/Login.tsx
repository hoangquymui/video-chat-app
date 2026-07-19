import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      await login({ email, password });
    } catch {
      setError("Email hoặc mật khẩu không đúng");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080b12] px-5">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-[360px] rounded-xl border border-white/8 bg-[#0d111b] p-6 shadow-2xl shadow-black/40"
      >
        <h1 className="text-center text-3xl font-bold text-white">Đăng nhập</h1>

        <p className="mt-1 text-center text-xs text-slate-500">VIDA workspace</p>

        <div className="mt-6">
          <label className="text-sm font-medium text-slate-300">Email</label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            className="mt-1.5 h-9 w-full rounded-lg border border-white/8 bg-white/5 px-3 text-sm text-white outline-none focus:border-indigo-500"
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-300">Mật khẩu</label>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="mt-1.5 h-9 w-full rounded-lg border border-white/8 bg-white/5 px-3 text-sm text-white outline-none focus:border-indigo-500"
          />
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-6 h-9 w-full rounded-lg bg-indigo-500 px-4 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          Đăng nhập
        </button>
      </form>
    </main>
  );
}

export default Login;
