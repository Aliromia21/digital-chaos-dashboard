import { useState } from "react";
import api from "../api/client";
import Card from "./Card";
import { toast } from "react-hot-toast";


const FIELDS = [
  "browserTabs","unusedBookmarks","screenshots","unusedApps",
  "desktopFiles","downloadsFiles","unreadEmails","spamEmails"
];

export default function SnapshotForm({ onCreated }) {
  const [form, setForm] = useState(Object.fromEntries(FIELDS.map(f => [f, ""])));
  const [notes, setNotes] = useState("");

  const submit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      browserTabs: Number(form.browserTabs || 0),
      unusedBookmarks: Number(form.unusedBookmarks || 0),
      screenshots: Number(form.screenshots || 0),
      unusedApps: Number(form.unusedApps || 0),
      desktopFiles: Number(form.desktopFiles || 0),
      downloadsFiles: Number(form.downloadsFiles || 0),
      unreadEmails: Number(form.unreadEmails || 0),
      spamEmails: Number(form.spamEmails || 0),
      notes,
    };
    const { data } = await api.post("/snapshots", payload);
    toast.success("Snapshot saved");
    onCreated?.(data.data);
    // reset
  } catch (err) {
    const msg = err?.response?.data?.message || "Request failed";
    toast.error(msg);
  }
};


  

  return (
    <Card title="Create Snapshot" subtitle="Daily input">
      <form onSubmit={submit} className="grid md:grid-cols-4 gap-3 mt-3">
        {FIELDS.map((f) => (
          <input key={f} value={form[f]}
            onChange={(e)=>setForm(s=>({...s,[f]:e.target.value}))}
            type="number" min="0"
            className="p-2 rounded-lg bg-slate-900/70 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder={f} />
        ))}
        <textarea value={notes} onChange={(e)=>setNotes(e.target.value)}
          className="md:col-span-4 p-3 rounded-lg bg-slate-900/70 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Notes (optional)"/>
        <button className="md:col-span-4 btn-primary justify-center">Save Snapshot</button>
      </form>
    </Card>
  );
}
