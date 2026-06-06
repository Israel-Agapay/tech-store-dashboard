import { useState } from "react";

type Props = {
  onLogin: () => void;
};

const Login = ({ onLogin }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://tech-store-dashboard.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      onLogin();
    } catch (error) {
      console.log(error);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="relative bg-zinc-950 min-h-screen flex items-center justify-center overflow-hidden">

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full bg-emerald-600/15 blur-[100px]" />

      <div className="relative z-10 w-full max-w-md mx-4">

        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full mb-8" />

        <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 shadow-2xl">

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">Tech Store</p>
              <p className="text-white font-bold text-sm leading-tight">Admin Panel</p>
            </div>
          </div>

          <h1 className="text-white text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-zinc-500 text-sm mb-8">Sign in to your admin account</p>

          {error && (
            <div className="mb-5 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2 font-medium">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <input
                type="email"
                placeholder="admin@techstore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 text-white placeholder:text-zinc-600 rounded-lg pl-10 pr-4 py-3 text-sm outline-none transition-colors"/>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2 font-medium">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 text-white placeholder:text-zinc-600 rounded-lg pl-10 pr-4 py-3 text-sm outline-none transition-colors"/>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20">
            {loading ? (<>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...</>) : (<>Sign In
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>

        </div>
        <div className="h-[1px] w-3/4 mx-auto bg-gradient-to-r from-transparent via-zinc-700 to-transparent mt-8" />
      </div>
    </div>
  );
};

export default Login;
