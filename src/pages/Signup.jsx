import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    // basic client validation
    if (!firstName.trim()) return setErr("Please enter your first name.");
    if (!lastName.trim()) return setErr("Please enter your last name.");
    if (!email.includes("@")) return setErr("Please enter a valid email.");
    if (password.length < 6) return setErr("Password must be 6+ characters.");
    if (password !== confirm) return setErr("Passwords do not match.");

    try {
      setLoading(true);

      // combine first & last name OR send separately depending on your backend
      await signup({
        email,
        password,
        full_name: `${firstName} ${lastName}`,
        // OR: first_name: firstName, last_name: lastName
      });

      nav("/", { replace: true });
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        e?.message ||
        "Signup failed. Please try again.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create your account</h1>

      <form onSubmit={onSubmit} className="space-y-4">
  {/* First & Last name in one row */}
  <div className="flex space-x-4">
    <div className="flex-1">
<label className="block text-sm font-medium text-left mb-1">
      First name
    </label>      
    <input
        className="w-full rounded-md border px-3 py-2"
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="John"
      />
    </div>

    <div className="flex-1">
<label className="block text-sm font-medium text-left mb-1">
      Last name
    </label>
          <input
        className="w-full rounded-md border px-3 py-2"
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Doe"
      />
    </div>
  </div>

  {/* Email */}
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

  {/* Password */}
  <div>
    <label className="block text-sm font-medium text-left mb-1">Password</label>
    <input
      className="w-full rounded-md border px-3 py-2"
      type="password"
      autoComplete="new-password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="••••••••"
    />
  </div>

  {/* Confirm password */}
  <div>
    <label className="block text-sm font-medium text-left mb-1">Confirm password</label>
    <input
      className="w-full rounded-md border px-3 py-2"
      type="password"
      autoComplete="new-password"
      value={confirm}
      onChange={(e) => setConfirm(e.target.value)}
      placeholder="••••••••"
    />
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
    {loading ? "Creating account..." : "Sign up"}
  </button>
</form>


      <p className="text-sm text-gray-600 mt-4">
        By signing up you agree to our{" "}
        <a href="/terms" className="underline">Terms</a> and{" "}
        <a href="/privacy" className="underline">Privacy Policy</a>.
      </p>
    </div>
  );
}
