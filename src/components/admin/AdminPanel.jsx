import { useState } from "react";
import { useMaintenance } from "@/src/context/MaintenanceContext";
import { Shield, LogOut, Power, MessageSquare, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPanel({ onClose }) {
  const { isAdmin, maintenance, message, login, logout, toggleMaintenance, updateMessage } = useMaintenance();
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [msgDraft, setMsgDraft] = useState(message);
  const [saved,    setSaved]    = useState(false);

  const handleLogin = () => {
    if (login(password)) { setError(""); setPassword(""); }
    else setError("Wrong password");
  };

  const handleSaveMsg = () => {
    updateMessage(msgDraft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 p-1">
      <div className="flex items-center gap-2 mb-1">
        <Shield className="w-4 h-4 text-indigo-400" />
        <span className="text-sm font-mono text-white">Admin Panel</span>
      </div>

      <AnimatePresence mode="wait">
        {!isAdmin ? (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
            <p className="text-[11px] text-zinc-500 font-mono">Enter admin password to continue</p>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Password"
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white font-mono outline-none focus:border-indigo-500/50 placeholder:text-white/20"
            />
            {error && <p className="text-[10px] text-red-400 font-mono">{error}</p>}
            <button onClick={handleLogin}
              className="w-full py-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono hover:bg-indigo-500/30 transition-colors">
              Login
            </button>
          </motion.div>
        ) : (
          <motion.div key="panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
            {/* Maintenance toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Power className={`w-4 h-4 ${maintenance ? "text-red-400" : "text-zinc-500"}`} />
                <span className="text-xs font-mono text-white/70">Maintenance Mode</span>
              </div>
              <button
                onClick={() => toggleMaintenance()}
                className={`relative w-10 h-5 rounded-full transition-colors ${maintenance ? "bg-red-500" : "bg-white/10"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${maintenance ? "left-5" : "left-0.5"}`} />
              </button>
            </div>

            {/* Maintenance message */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Maintenance Message</span>
              </div>
              <textarea
                value={msgDraft}
                onChange={e => setMsgDraft(e.target.value)}
                rows={3}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white font-mono outline-none focus:border-indigo-500/50 resize-none"
              />
              <button onClick={handleSaveMsg}
                className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs font-mono text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors">
                {saved ? <><Check className="w-3 h-3 text-green-400" /> Saved</> : "Save Message"}
              </button>
            </div>

            {/* Status */}
            <div className={`px-3 py-2 rounded-lg text-[10px] font-mono text-center ${maintenance ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-green-500/10 border border-green-500/20 text-green-400"}`}>
              Site is {maintenance ? "UNDER MAINTENANCE" : "LIVE"}
            </div>

            {/* Logout */}
            <button onClick={logout}
              className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg border border-white/[0.06] text-xs font-mono text-white/30 hover:text-white/60 transition-colors">
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
