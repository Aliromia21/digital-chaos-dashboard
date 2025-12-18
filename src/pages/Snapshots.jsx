import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../api/client";
import SnapshotTable from "../components/SnapshotTable";
import Card from "../components/Card";
import { useAuth } from "../auth/AuthContext";

export default function Snapshots() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [query, setQuery] = useState({ page: 1, limit: 20, sort: "-date" });

  const load = useCallback(async () => {
    try {
      setErr("");
      setLoading(true);

      const res = await api.get("/snapshots", { params: query });
      setItems(res.data.items || []);
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to load snapshots";
      setErr(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [query]);

   //Reset data and page state when the user changes
  useEffect(() => {
    setItems([]);
    setErr("");
    setQuery({ page: 1, limit: 20, sort: "-date" });
    setLoading(true);
  }, [user]);

  // Fetch data only when user exists
  useEffect(() => {
    if (!user) return;
    load();
  }, [user, load]);

  const createQuick = async () => {
    try {
      const payload = {
        browserTabs: 5,
        unusedBookmarks: 1,
        screenshots: 0,
        unusedApps: 0,
        desktopFiles: 0,
        downloadsFiles: 0,
        unreadEmails: 10,
        spamEmails: 0,
        notes: "Quick create from dashboard UI",
      };

      await api.post("/snapshots", payload);
      toast.success("Snapshot saved");
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to create snapshot");
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6 space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="kicker">Your History</div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Snapshots
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-primary" onClick={load} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button className="btn-primary" onClick={createQuick} disabled={loading}>
            + Quick Snapshot
          </button>
        </div>
      </div>

      {err ? (
        <Card title="Error" subtitle="Something went wrong">
          <p className="text-rose-300">{err}</p>
        </Card>
      ) : null}

      <SnapshotTable items={items} loading={loading} onChanged={load} />

      {!loading && !items?.length ? (
        <Card title="No snapshots yet" subtitle="Start tracking your digital chaos">
          <p className="text-slate-400">
            Create your first snapshot to see stats and weekly trends.
          </p>
        </Card>
      ) : null}
    </div>
  );
}
