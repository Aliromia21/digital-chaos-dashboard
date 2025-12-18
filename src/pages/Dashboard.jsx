import { useEffect, useMemo, useState, useCallback } from "react";
import api from "../api/client";
import Card from "../components/Card";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";
import AddSnapshotModal from "../components/modals/AddSnapshotModal";
import ChaosGauge from "../components/charts/ChaosGauge";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";
import { CircleAlert, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// Color based on chaos level
const scoreColor = (s) => {
  const n = Number(s) || 0;
  if (n >= 75) return "#fb7185"; // rose
  if (n >= 45) return "#fbbf24"; // amber
  return "#34d399"; // emerald
};

// Format day labels (whether dayKey or ISO)
function niceDayLabel(v) {
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
}

// Quick normalization for breakdown values 
function normalizeBreakdown(today) {
// Approximate limits for display only (to give the radar a logical shape)
  const MAX = {
    browserTabs: 60,
    unusedBookmarks: 40,
    screenshots: 40,
    unusedApps: 20,
    desktopFiles: 80,
    downloadsFiles: 50,
    unreadEmails: 300,
    spamEmails: 200,
  };

  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const toPct = (val, max) => Math.round(clamp01((Number(val) || 0) / max) * 100);

  return [
    { metric: "Tabs", v: toPct(today?.browserTabs, MAX.browserTabs), raw: today?.browserTabs ?? 0 },
    { metric: "Bookmarks", v: toPct(today?.unusedBookmarks, MAX.unusedBookmarks), raw: today?.unusedBookmarks ?? 0 },
    { metric: "Screens", v: toPct(today?.screenshots, MAX.screenshots), raw: today?.screenshots ?? 0 },
    { metric: "Apps", v: toPct(today?.unusedApps, MAX.unusedApps), raw: today?.unusedApps ?? 0 },
    { metric: "Desktop", v: toPct(today?.desktopFiles, MAX.desktopFiles), raw: today?.desktopFiles ?? 0 },
    { metric: "Downloads", v: toPct(today?.downloadsFiles, MAX.downloadsFiles), raw: today?.downloadsFiles ?? 0 },
    { metric: "Unread", v: toPct(today?.unreadEmails, MAX.unreadEmails), raw: today?.unreadEmails ?? 0 },
    { metric: "Spam", v: toPct(today?.spamEmails, MAX.spamEmails), raw: today?.spamEmails ?? 0 },
  ];
}

export default function Dashboard() {
  const { user } = useAuth();

  const [today, setToday] = useState(null);
  const [week, setWeek] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [openAdd, setOpenAdd] = useState(false);

  const load = useCallback(async () => {
    try {
      setErr("");
      setLoading(true);

      const [t, w, s] = await Promise.all([
        api.get("/dashboard/today"),
        api.get("/dashboard/week"),
        api.get("/dashboard/stats"),
      ]);

      setToday(t.data.data);
      setWeek(w.data.data || []);
      setStats(s.data.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  // reset & load on user change
  useEffect(() => {
    setToday(null);
    setWeek([]);
    setStats(null);
    setErr("");
    setLoading(true);

    if (user) load();
  }, [user, load]);

  // ====== chart data ======
  const weekArea = useMemo(() => {
    return (week || []).map((d) => ({
      day: niceDayLabel(d.day),
      chaosScore: Number(d.chaosScore ?? 0),
    }));
  }, [week]);

  const worstBars = useMemo(() => {
// Note: data covers the last 7 days (source: /week)
    return (week || [])
      .slice()
      .sort((a, b) => (b.chaosScore ?? 0) - (a.chaosScore ?? 0))
      .slice(0, 5)
      .map((d) => ({ day: niceDayLabel(d.day), score: Number(d.chaosScore ?? 0) }));
  }, [week]);

  const gaugeData = useMemo(() => {
    const score = Number(today?.chaosScore ?? 0);
    return [{ name: "score", value: score, fill: scoreColor(score) }];
  }, [today]);

  const breakdown = useMemo(() => normalizeBreakdown(today), [today]);

  if (loading) return <DashboardSkeleton />;

  if (err) {
    return (
      <div className="mx-auto max-w-6xl p-6" aria-live="polite">
        <div className="flex items-center gap-3 text-rose-300">
          <CircleAlert /> {err}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-3">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold tracking-tight"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Dashboard
        </motion.h1>

        <button className="btn-primary flex items-center gap-2" onClick={() => setOpenAdd(true)}>
          <Plus size={18} />
          Add Snapshot
        </button>
      </div>

       <Card className="flex items-center justify-center">
            <ChaosGauge value={today?.chaosScore || 0} />
         </Card>


      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title={today?.chaosScore ?? "—"} subtitle="Today’s Chaos Score">
          <p className="mt-1 text-sm text-slate-400">
            {today?.date ? new Date(today.date).toDateString() : "No snapshot today"}
          </p>
        </Card>

        <Card title={today?.browserTabs ?? "—"} subtitle="Open Tabs" />
        <Card title={today?.unreadEmails ?? "—"} subtitle="Unread Emails" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Gauge */}
        <Card className="p-0 overflow-hidden">
          <div className="px-5 pt-5">
            <div className="kicker">Today</div>
            <h3 className="text-lg font-semibold">Chaos Gauge</h3>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="55%"
                innerRadius="70%"
                outerRadius="95%"
                startAngle={180}
                endAngle={0}
                data={gaugeData}
              >
                <RadialBar dataKey="value" cornerRadius={10} />
                <Tooltip
                  contentStyle={{
                    background: "#0b1220",
                    border: "1px solid #1e293b",
                    borderRadius: 12,
                    color: "#e2e8f0",
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>

            <div className="-mt-8 text-center">
              <div className="text-4xl font-extrabold">{today?.chaosScore ?? "—"}</div>
              <div className="text-sm text-slate-400">out of 100</div>
            </div>
          </div>
        </Card>

        {/* Worst days */}
        <Card className="p-0 overflow-hidden">
          <div className="px-5 pt-5">
            <div className="kicker">History</div>
            <h3 className="text-lg font-semibold">Worst Days (Last 7)</h3>
          </div>

          <div className="h-64 p-2">
            {worstBars.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={worstBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      background: "#0b1220",
                      border: "1px solid #1e293b",
                      borderRadius: 12,
                      color: "#e2e8f0",
                    }}
                  />
                  <Bar dataKey="score" radius={[10, 10, 0, 0]} fill="#38bdf8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState>
                <div className="text-slate-400">No data yet.</div>
              </EmptyState>
            )}
          </div>
        </Card>

        {/* Breakdown radar */}
        <Card className="p-0 overflow-hidden">
          <div className="px-5 pt-5">
            <div className="kicker">Breakdown</div>
            <h3 className="text-lg font-semibold">What Drives Today?</h3>
            <p className="mt-1 text-xs text-slate-500">
              Normalized to 0–100 for clearer comparison.
            </p>
          </div>

          <div className="h-64 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={breakdown}>
                <PolarGrid stroke="#0f172a" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name, props) => {
                   // Display percentage along with the actual value
                    const raw = props?.payload?.raw ?? 0;
                    return [`${value}% (raw: ${raw})`, "impact"];
                  }}
                  contentStyle={{
                    background: "#0b1220",
                    border: "1px solid #1e293b",
                    borderRadius: 12,
                    color: "#e2e8f0",
                  }}
                />
                <Radar
                  name="Today"
                  dataKey="v"
                  stroke="#38bdf8"
                  fill="#38bdf8"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Weekly Trend */}
      <Card className="p-0 overflow-hidden">
        <div className="px-5 pt-5 flex items-center justify-between gap-3">
          <div>
            <div className="kicker">Weekly Chaos Trend</div>
            <h3 className="text-lg font-semibold">Last 7 Days</h3>
          </div>

          {!weekArea.length ? (
            <Link to="/snapshots" className="btn-primary">
              Create Snapshot
            </Link>
          ) : null}
        </div>

        <div className="h-72 p-2">
          {weekArea.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekArea}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.1} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis domain={[0, 100]} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#0b1220",
                    border: "1px solid #1e293b",
                    borderRadius: 12,
                    color: "#e2e8f0",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="chaosScore"
                  stroke="#38bdf8"
                  fill="url(#g1)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState>
              <div className="text-slate-400">No weekly data yet.</div>
              <div className="text-xs text-slate-500">Create your first snapshot to see trends.</div>
            </EmptyState>
          )}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title={stats?.maxScore ?? "—"} subtitle="Worst Day Score" />
        <Card title={stats?.minScore ?? "—"} subtitle="Best Day Score" />
        <Card title={stats?.avgScore?.toFixed?.(1) ?? "—"} subtitle="Average Score" />
      </div>

      <AddSnapshotModal open={openAdd} onClose={() => setOpenAdd(false)} onCreated={load} />
    </div>
  );
}

function EmptyState({ children }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-2">
      {children}
    </div>
  );
}
