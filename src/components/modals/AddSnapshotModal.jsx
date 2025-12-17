import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../api/client";

const FIELDS = [
  { key: "browserTabs", label: "Browser Tabs" },
  { key: "unusedBookmarks", label: "Unused Bookmarks" },
  { key: "screenshots", label: "Screenshots" },
  { key: "unusedApps", label: "Unused Apps" },
  { key: "desktopFiles", label: "Desktop Files" },
  { key: "downloadsFiles", label: "Downloads Files" },
  { key: "unreadEmails", label: "Unread Emails" },
  { key: "spamEmails", label: "Spam Emails" },
];

function toNonNegativeInt(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.trunc(n));
}

export default function AddSnapshotModal({ open, onClose, onCreated }) {
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    date: "", // optional
    browserTabs: 0,
    unusedBookmarks: 0,
    screenshots: 0,
    unusedApps: 0,
    desktopFiles: 0,
    downloadsFiles: 0,
    unreadEmails: 0,
    spamEmails: 0,
    notes: "",
  });

  const canSubmit = useMemo(() => {
    return FIELDS.every((f) => Number.isFinite(Number(form[f.key])) && Number(form[f.key]) >= 0);
  }, [form]);

  const setNum = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Please enter valid non-negative numbers.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        // date اختياري: إذا فارغ لا نرسله
        ...(form.date ? { date: new Date(form.date).toISOString() } : {}),
        ...FIELDS.reduce((acc, f) => {
          acc[f.key] = toNonNegativeInt(form[f.key]);
          return acc;
        }, {}),
        notes: form.notes?.trim() || "",
      };

      await api.post("/snapshots", payload);

      toast.success("Snapshot saved");
      onClose?.();
      onCreated?.(); // refresh dashboard / snapshots
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create snapshot");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <button
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* modal */}
      <div className="relative mx-auto mt-10 w-[92%] max-w-2xl rounded-2xl border border-white/10 bg-slate-950 p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="kicker">Daily Input</div>
            <h2 className="text-xl font-semibold">Add Snapshot</h2>
            <p className="mt-1 text-sm text-slate-400">
              Fill in today’s numbers. We’ll calculate your chaos score automatically.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
          >
            Close
          </button>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-5">
          {/* optional date */}
          <div className="grid gap-2">
            <label className="text-sm text-slate-300">Date (optional)</label>
            <input
              type="datetime-local"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-100 outline-none focus:border-sky-500/60"
            />
          </div>

          {/* numeric fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FIELDS.map((f) => (
              <div key={f.key} className="grid gap-2">
                <label className="text-sm text-slate-300">{f.label}</label>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={form[f.key]}
                  onChange={(e) => setNum(f.key, e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-100 outline-none focus:border-sky-500/60"
                />
              </div>
            ))}
          </div>

          {/* notes */}
          <div className="grid gap-2">
            <label className="text-sm text-slate-300">Notes (optional)</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-100 outline-none focus:border-sky-500/60"
              placeholder="Anything you want to remember about today..."
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm text-slate-200 hover:bg-white/5"
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || !canSubmit}
            >
              {submitting ? "Saving..." : "Save Snapshot"}
            </button>
          </div>

          <p className="text-xs text-slate-500">
            If you already created a snapshot for today, you’ll get a 409 conflict.
          </p>
        </form>
      </div>
    </div>
  );
}
