import { useState } from "react";
import { useMaintenance } from "@/src/context/MaintenanceContext";
import { Shield, LogOut, Power, MessageSquare, Check, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin, maintenance, message, login, logout, toggleMaintenance, updateMessage } = useMaintenance();
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [msgDraft, setMsgDraft] = useState(message);
  const [saved,    setSaved]    = useState(false);

  const handleLogin = () => {
    if (login(password)) { setError(""); setPassword(""); }
    else setError("Incorrect password");
  };

  const handleSaveMsg = () => {
    updateMessage(msgDraft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#000" }}>

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ position: "relative", zIndex: 10, width: "min(92vw, 440px)" }}
      >
        {/* back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-white/30 hover:text-white text-xs font-mono mb-6 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <div style={{
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "36px 32px",
        }}>
          {/* header */}
          <div className="flex items-center gap-3 mb-8">
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#111", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield style={{ width: 18, height: 18, color: "rgba(255,255,255,0.6)" }} />
            </div>
            <div>
              <h1 className="text-white font-mono font-bold text-lg">Admin Panel</h1>
              <p className="text-white/30 font-mono text-[11px]">COSMIC — site management</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isAdmin ? (
              <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
                <p className="text-white/40 font-mono text-xs">Enter your admin password to continue.</p>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  placeholder="Password"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white font-mono outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
                {error && <p className="text-red-400 font-mono text-xs">{error}</p>}
                <button onClick={handleLogin}
                  className="w-full py-3 rounded-xl font-mono text-sm font-semibold transition-all"
                  style={{ background: "#fff", border: "none", color: "#000", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.88)"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  Login
                </button>
              </motion.div>
            ) : (
              <motion.div key="panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">

                {/* status banner */}
                <div style={{
                  padding: "12px 16px", borderRadius: 12,
                  background: maintenance ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)",
                  border: `1px solid ${maintenance ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div className="flex items-center gap-2">
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: maintenance ? "#ef4444" : "#22c55e", boxShadow: `0 0 8px ${maintenance ? "#ef4444" : "#22c55e"}` }} />
                    <span className="font-mono text-xs" style={{ color: maintenance ? "#fca5a5" : "#86efac" }}>
                      Site is {maintenance ? "UNDER MAINTENANCE" : "LIVE"}
                    </span>
                  </div>
                  {/* toggle */}
                  <button onClick={() => toggleMaintenance()}
                    style={{
                      position: "relative", width: 44, height: 24, borderRadius: 999,
                      background: maintenance ? "#ef4444" : "rgba(255,255,255,0.1)",
                      border: "none", cursor: "pointer", transition: "background 0.2s",
                    }}>
                    <span style={{
                      position: "absolute", top: 3, width: 18, height: 18, borderRadius: "50%",
                      background: "#fff", transition: "left 0.2s",
                      left: maintenance ? 23 : 3,
                    }} />
                  </button>
                </div>

                {/* message editor */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare style={{ width: 13, height: 13, color: "rgba(255,255,255,0.3)" }} />
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Maintenance Message</span>
                  </div>
                  <textarea
                    value={msgDraft}
                    onChange={e => setMsgDraft(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl px-4 py-3 text-xs text-white font-mono outline-none resize-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                  <button onClick={handleSaveMsg}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl font-mono text-xs transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: saved ? "#86efac" : "rgba(255,255,255,0.5)" }}>
                    {saved ? <><Check style={{ width: 12, height: 12 }} /> Saved</> : "Save Message"}
                  </button>
                </div>

                {/* logout */}
                <button onClick={logout}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl font-mono text-xs transition-all"
                  style={{ border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)" }}
                  onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}
                >
                  <LogOut style={{ width: 12, height: 12 }} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
