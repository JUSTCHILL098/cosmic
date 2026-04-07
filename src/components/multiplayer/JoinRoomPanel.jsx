import { useState } from "react";
import { useMultiplayer } from "@/src/context/MultiplayerContext";
import { Users, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function JoinRoomPanel() {
  const [open,     setOpen]     = useState(false);
  const [code,     setCode]     = useState("");
  const { joinRoom, isInRoom } = useMultiplayer();

  const handle = () => {
    if (code.trim()) { joinRoom(code.trim()); setOpen(false); setCode(""); }
  };

  if (isInRoom) return null;

  return (
    <>
      <div className="fixed bottom-20 left-4 z-40">
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl font-mono text-xs font-semibold transition-all"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <Users className="w-3.5 h-3.5" /> Join Room
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 z-50" style={{ background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)" }}
              onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity:0, scale:0.96, y:8 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.96, y:8 }}
              transition={{ duration:0.18 }}
              className="fixed bottom-36 left-4 z-50"
              style={{ width: "min(92vw, 300px)" }}
            >
              <div style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, padding:"24px 20px" }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-white/40" />
                    <h3 className="text-white font-mono font-bold text-sm">Join a Room</h3>
                  </div>
                  <button onClick={() => setOpen(false)} className="text-white/25 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === "Enter" && handle()}
                    placeholder="Room code (e.g. ABC123)"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white font-mono outline-none placeholder:text-white/20 tracking-widest"
                    style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)" }}
                    onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.3)"}
                    onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                    autoFocus
                  />
                  <button
                    onClick={handle}
                    disabled={!code.trim()}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-mono text-sm font-semibold transition-all disabled:opacity-30"
                    style={{ background:"#fff", color:"#000", border:"none", cursor: code.trim() ? "pointer" : "not-allowed" }}
                  >
                    Join Room <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
