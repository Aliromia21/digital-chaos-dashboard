import { motion } from "framer-motion";

export default function ChaosGauge({ value = 0 }) {
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#1e293b"
            strokeWidth="10"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="10"
            strokeDasharray={`${pct * 2.64} 264`}
            initial={{ strokeDasharray: "0 264" }}
            animate={{ strokeDasharray: `${pct * 2.64} 264` }}
            transition={{ duration: 1 }}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-extrabold">{pct}</span>
        </div>
      </div>

      <p className="mt-2 text-sm text-slate-400">Chaos Score</p>
    </div>
  );
}
