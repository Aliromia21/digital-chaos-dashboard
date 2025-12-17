import { motion } from "framer-motion";

export default function Card({ title, subtitle, children, className = "" }) {
  return (
    <motion.section
      className={`card p-5 ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {title && <div className="kicker">{subtitle || ""}</div>}
      {title && <h3 className="text-lg font-semibold leading-tight">{title}</h3>}
      {children}
    </motion.section>
  );
}
