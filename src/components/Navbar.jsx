import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { LogOut, Gauge, Images } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_20px_#38bdf8]" />
          <span className="font-semibold tracking-tight">Digital Chaos Index</span>
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg hover:bg-slate-800 ${
                isActive ? "bg-slate-800 text-sky-300" : "text-slate-300"
              }`
            }
          >
            <span className="flex items-center gap-2">
              <Gauge size={16} /> Dashboard
            </span>
          </NavLink>

          <NavLink
            to="/snapshots"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg hover:bg-slate-800 ${
                isActive ? "bg-slate-800 text-sky-300" : "text-slate-300"
              }`
            }
          >
            <span className="flex items-center gap-2">
              <Images size={16} /> Snapshots
            </span>
          </NavLink>

          <div className="mx-2 h-6 w-px bg-slate-800" />

          <span className="hidden sm:block text-slate-400">{user?.name || "Guest"}</span>

          {user ? (
            <button onClick={logout} className="btn-primary ml-2">
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <Link to="/login" className="btn-primary ml-2">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
