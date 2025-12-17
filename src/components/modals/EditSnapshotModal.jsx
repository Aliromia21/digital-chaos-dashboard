import { useEffect, useMemo, useState } from "react";
import ModalPortal from "../ModalPortal";
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

const toInt = (v) => Math.max(0, Number(v) || 0);

const toDatetimeLocal = (dateLike) => {
  if (!dateLike) return "";
  const d = new Date(dateLike);
  const pad = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

export default function EditSnapshotModal({ open, onClose, snapshot, onUpdated }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !snapshot) return;

    setForm({
      date: toDatetimeLocal(snapshot.date),
      notes: snapshot.notes || "",
      ...FIELDS.reduce((acc, f) => {
        acc[f.key] = snapshot[f.key] ?? 0;
        return acc;
      }, {}),
    });
  }, [open, snapshot]);

  const canSubmit = useMemo(
    () => FIELDS.every((f) => Number.isFinite(Number(form[f.key]))),
    [form]
  );

  const submit = async (e) => {
    e.preventDefault();
    if (!snapshot?._id) return;

    try {
      setSaving(true);

      const payload = {
        ...(form.date && { date: new Date(form.date).toISOString() }),
        notes: form.notes?.trim() || "",
        ...FIELDS.reduce((acc, f) => {
          acc[f.key] = toInt(form[f.key]);
          return acc;
        }, {}),
      };

      await api.patch(`/snapshots/${snapshot._id}`, payload);

      toast.success("Snapshot updated");
      onClose();
      onUpdated?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center">
        {/* Backdrop */}
        <button
          onClick={onClose}
          className="absolute inset-0 bg-black/60"
          aria-label="Close modal"
        />

        {/* Modal */}
        <div className="relative mt-20 w-[92%] max-w-2xl rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="kicker">Edit</div>
              <h2 className="text-xl font-semibold">Update Snapshot</h2>
              <p className="mt-1 text-sm text-slate-400">
                Update values and chaos score will be recalculated.
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
            >
              Close
            </button>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-5">
            <div>
              <label className="text-sm text-slate-300">Date (optional)</label>
              <input
                type="datetime-local"
                value={form.date || ""}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-sky-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FIELDS.map((f) => (
                <div key={f.key}>
                  <label className="text-sm text-slate-300">{f.label}</label>
                  <input
                    type="number"
                    min={0}
                    value={form[f.key] ?? 0}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-sky-500 outline-none"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="text-sm text-slate-300">Notes</label>
              <textarea
                rows={3}
                value={form.notes || ""}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-sky-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-sm text-slate-200 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit || saving}
                className="btn-primary"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
