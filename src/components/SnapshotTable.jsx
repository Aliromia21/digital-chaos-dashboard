import { useMemo, useState } from "react";
import Card from "./Card";
import EditSnapshotModal from "./modals/EditSnapshotModal";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";

function fmtDate(d) {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "—";
  }
}

export default function SnapshotTable({ items = [], loading = false, onChanged }) {
  const [editOpen, setEditOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const rows = useMemo(() => items || [], [items]);

  const openEdit = (snap) => {
    setSelected(snap);
    setEditOpen(true);
  };

  const openDelete = (snap) => {
    setSelected(snap);
    setDelOpen(true);
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="kicker">Latest</div>
          <h3 className="text-lg font-semibold">Your snapshots</h3>
        </div>
        <div className="text-sm text-slate-400">
          {loading ? "Loading..." : `${rows.length} items`}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Date</th>
              <th className="text-left px-4 py-3 font-medium">Chaos</th>
              <th className="text-left px-4 py-3 font-medium">Tabs</th>
              <th className="text-left px-4 py-3 font-medium">Unread</th>
              <th className="text-left px-4 py-3 font-medium">Notes</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {!loading && !rows.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No snapshots yet.
                </td>
              </tr>
            ) : null}

            {rows.map((s) => (
              <tr key={s._id} className="hover:bg-white/[0.03]">
                <td className="px-4 py-3 text-slate-200">{fmtDate(s.date)}</td>
                <td className="px-4 py-3 text-slate-200">{s.chaosScore ?? "—"}</td>
                <td className="px-4 py-3 text-slate-200">{s.browserTabs ?? "—"}</td>
                <td className="px-4 py-3 text-slate-200">{s.unreadEmails ?? "—"}</td>
                <td className="px-4 py-3 text-slate-400 max-w-[340px] truncate">
                  {s.notes || "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-lg px-3 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10"
                      onClick={() => openEdit(s)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg px-3 py-2 text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/20 text-rose-200 border border-rose-500/30"
                      onClick={() => openDelete(s)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditSnapshotModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        snapshot={selected}
        onUpdated={onChanged}
      />

      <ConfirmDeleteModal
        open={delOpen}
        onClose={() => setDelOpen(false)}
        snapshot={selected}
        onDeleted={onChanged}
      />
    </Card>
  );
}
