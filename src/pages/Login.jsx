// src/pages/Login.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from =
    (typeof loc.state?.from === "string" && loc.state.from) ||
    (typeof loc.state?.from?.pathname === "string" && loc.state.from.pathname) ||
    "/colorize";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email.includes("@")) return setErr("Please enter a valid email.");
    if (!password) return setErr("Please enter your password.");

    try {
      setLoading(true);
      await login(email, password);
      nav("/", { replace: true });
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        e?.message ||
        "Login failed. Please try again.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
      <p className="text-gray-600 mb-6">Log in to your account</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-left mb-1">Email</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-left mb-1">Password</label>
          <div className="relative">
            <input
              className="w-full rounded-md border px-3 py-2 pr-10"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {err && (
          <div className="rounded-md bg-red-50 border border-red-200 p-2 text-sm text-red-700">
            {err}
          </div>
        )}

        <button
          className="w-full rounded-md bg-black text-white py-2 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Log in"}
        </button>
      </form>

      <div className="flex items-center justify-between mt-4 text-sm">
        <Link to="/forgot" className="underline text-gray-700">
          Forgot password?
        </Link>
        <span className="text-gray-600">
          New here?{" "}
          <Link to="/signup" className="underline">
            Create an account
          </Link>
        </span>
      </div>

      {/* Optional: demo login */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() =>
            login("demo@example.com", "demopass")
              .then(() => nav(from, { replace: true }))
              .catch(() => setErr("Demo user not available."))
          }
          className="w-full rounded-md border py-2"
        >
          Try a demo account
        </button>
      </div>
    </div>
  );
}
