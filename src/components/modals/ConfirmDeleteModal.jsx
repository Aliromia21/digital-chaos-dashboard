import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../api/client";
import ModalPortal from "../ModalPortal";

export default function ConfirmDeleteModal({ open, onClose, snapshot, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const del = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    if (!snapshot?._id || loading) return;

    try {
      setLoading(true);
      await api.delete(`/snapshots/${snapshot._id}`);
      toast.success("Snapshot deleted");
      onClose?.();
      onDeleted?.(); // refresh list
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete snapshot");
    } finally {
      setLoading(false);
    }
  };

  const close = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (loading) return;
    onClose?.();
  };

  if (!open) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <button
          className="absolute inset-0 bg-black/60"
          onClick={close}
          aria-label="Close modal"
          type="button"
        />

        {/* Modal */}
        <div
          className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-5 shadow-2xl"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="kicker">Danger zone</div>
          <h2 className="text-xl font-semibold">Delete snapshot?</h2>
          <p className="mt-2 text-sm text-slate-400">
            This action cannot be undone. The snapshot will be permanently removed.
          </p>

          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              onClick={close}
              type="button"
              disabled={loading}
              className="rounded-xl px-4 py-2 text-sm text-slate-200 hover:bg-white/5 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              onClick={del}
              type="button"
              disabled={loading}
              className="rounded-xl px-4 py-2 text-sm font-semibold bg-rose-500 text-white hover:bg-rose-400 disabled:opacity-60"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
