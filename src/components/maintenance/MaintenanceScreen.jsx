import { motion } from "framer-motion";
import { useMaintenance } from "@/src/context/MaintenanceContext";
import { Wrench } from "lucide-react";

export default function MaintenanceScreen() {
  const { message, isAdmin, toggleMaintenance } = useMaintenance();

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999999 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: "min(92vw, 420px)",
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          padding: "48px 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* icon */}
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: "#111",
          border: "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 24,
        }}>
          <Wrench style={{ width: 24, height: 24, color: "rgba(255,255,255,0.6)" }} />
        </div>

        <h1 style={{ color: "#fff", fontFamily: "monospace", fontWeight: 900, fontSize: "1.75rem", letterSpacing: "-0.03em", marginBottom: 12 }}>
          Under Maintenance
        </h1>

        <p style={{ color: "rgba(255,255,255,0.35)", fontFamily: "monospace", fontSize: 13, lineHeight: 1.75, marginBottom: 28, maxWidth: 320 }}>
          {message}
        </p>

        {/* status */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "5px 14px", borderRadius: 999,
          background: "#111", border: "1px solid rgba(255,255,255,0.08)",
          marginBottom: isAdmin ? 20 : 0,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", animation: "mp 2s infinite" }} />
          <span style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Site offline
          </span>
        </div>

        {isAdmin && (
          <button
            onClick={() => toggleMaintenance(false)}
            style={{
              padding: "9px 24px", borderRadius: 8,
              background: "#fff", border: "none",
              color: "#000", fontFamily: "monospace", fontSize: 12, fontWeight: 700,
              cursor: "pointer", transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Disable Maintenance
          </button>
        )}
      </motion.div>
      <style>{`@keyframes mp { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}
