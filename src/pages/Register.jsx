import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password;

    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setSubmitting(true);
      await register(name, email, password);
      toast.success("Account created");
      nav("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 bg-white/5 p-6 rounded-xl border border-slate-800">
        <h1 className="text-xl font-semibold">Create account</h1>

        <input
          className="w-full p-2 rounded border border-slate-700 bg-slate-900/50"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />

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
          placeholder="Password (min 6)"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />

        <button
          disabled={submitting}
          className="w-full py-2 rounded bg-sky-500 hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed text-white"
        >
          {submitting ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-slate-400">
          Have an account?{" "}
          <Link to="/login" className="text-sky-400 hover:text-sky-300">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
