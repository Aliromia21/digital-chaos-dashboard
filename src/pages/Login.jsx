import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      toast.success("Welcome back");

      // إذا تم تحويلك بسبب 401 أو من ProtectedRoute
      const from = new URLSearchParams(loc.search).get("from");
      nav(from || "/", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-4 bg-white/5 p-6 rounded-xl border border-slate-800"
      >
        <h1 className="text-xl font-semibold">Login</h1>

        <input
          type="email"
          className="w-full p-2 rounded border border-slate-700 bg-slate-900/50"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />

        <input
          type="password"
          className="w-full p-2 rounded border border-slate-700 bg-slate-900/50"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />

        <button
          disabled={submitting}
          className="w-full py-2 rounded bg-sky-500 hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed text-white"
        >
          {submitting ? "Signing in..." : "Login"}
        </button>

        <p className="text-sm text-slate-400">
          Don’t have an account?{" "}
          <Link to="/register" className="text-sky-400 hover:text-sky-300">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
