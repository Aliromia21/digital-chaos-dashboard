export default function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6 animate-pulse">
      <div className="h-10 w-48 bg-slate-800 rounded-xl" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-6">
            <div className="h-4 w-24 bg-slate-800 rounded mb-3" />
            <div className="h-8 w-16 bg-slate-800 rounded" />
          </div>
        ))}
      </div>

      <div className="card p-6">
        <div className="h-4 w-40 bg-slate-800 rounded mb-3" />
        <div className="h-64 bg-slate-800 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-6">
            <div className="h-4 w-28 bg-slate-800 rounded mb-3" />
            <div className="h-8 w-16 bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
