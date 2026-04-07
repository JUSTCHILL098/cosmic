import { useState, useEffect } from "react";
import { useMaintenance } from "@/src/context/MaintenanceContext";
import { Shield, LogOut, Power, MessageSquare, Check, ArrowLeft, Users, User, Tv, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/src/lib/supabase";

function UsersList() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, username, avatar_url, level, xp, episodes_watched, created_at, bio")
      .order("episodes_watched", { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (error) console.warn(error.message);
        setUsers(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = users.filter(u =>
    !search || u.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-3 py-2 rounded-xl text-sm text-white font-mono outline-none"
        style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}
      />
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-5 h-5 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-white/20 font-mono text-xs text-center py-6">No users found</p>
      ) : (
        <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
          {filtered.map(u => (
            <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0"
                style={{ background:"#111", border:"1px solid rgba(255,255,255,0.08)" }}>
                {u.avatar_url
                  ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><User className="w-4 h-4 text-white/20" /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono font-semibold text-white truncate">{u.username || "Anonymous"}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-[10px] font-mono text-white/30">
                    <Star className="w-2.5 h-2.5" /> Lv {u.level || 1}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-white/30">
                    <Tv className="w-2.5 h-2.5" /> {(u.episodes_watched || 0).toLocaleString()} eps
                  </span>
                </div>
              </div>
              <div className="text-[9px] font-mono text-white/20 flex-shrink-0">
                {u.created_at ? new Date(u.created_at).toLocaleDateString("en-GB") : ""}
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-[10px] font-mono text-white/20 text-center">{filtered.length} users</p>
    </div>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin, maintenance, message, login, logout, toggleMaintenance, updateMessage } = useMaintenance();
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [msgDraft, setMsgDraft] = useState(message);
  const [saved,    setSaved]    = useState(false);
  const [tab,      setTab]      = useState("maintenance");

  const handleLogin = () => {
    if (login(password)) { setError(""); setPassword(""); }
    else setError("Incorrect password");
  };

  const handleSaveMsg = () => {
    updateMessage(msgDraft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle = { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background:"#000" }}>
      <motion.div
        initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
        style={{ width:"min(92vw, 520px)" }}
      >
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-white/30 hover:text-white text-xs font-mono mb-6 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <div style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"32px 28px" }}>
          <div className="flex items-center gap-3 mb-6">
            <div style={{ width:40, height:40, borderRadius:10, background:"#111", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Shield style={{ width:18, height:18, color:"rgba(255,255,255,0.6)" }} />
            </div>
            <div>
              <h1 className="text-white font-mono font-bold text-lg">Admin Panel</h1>
              <p className="text-white/30 font-mono text-[11px]">COSMIC — site management</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isAdmin ? (
              <motion.div key="login" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="flex flex-col gap-4">
                <p className="text-white/40 font-mono text-xs">Enter admin password to continue.</p>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  placeholder="Password"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white font-mono outline-none"
                  style={inputStyle} />
                {error && <p className="text-red-400 font-mono text-xs">{error}</p>}
                <button onClick={handleLogin}
                  className="w-full py-3 rounded-xl font-mono text-sm font-semibold"
                  style={{ background:"#fff", color:"#000", border:"none", cursor:"pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.88)"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  Login
                </button>
              </motion.div>
            ) : (
              <motion.div key="panel" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="flex flex-col gap-4">
                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-xl" style={{ background:"rgba(255,255,255,0.04)" }}>
                  {[{id:"maintenance",icon:Power,label:"Maintenance"},{id:"users",icon:Users,label:"Users"}].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all"
                      style={{ background:tab===t.id?"rgba(255,255,255,0.1)":"transparent", color:tab===t.id?"#fff":"rgba(255,255,255,0.35)" }}>
                      <t.icon className="w-3.5 h-3.5" /> {t.label}
                    </button>
                  ))}
                </div>

                {tab === "maintenance" && (
                  <div className="flex flex-col gap-4">
                    {/* Status toggle */}
                    <div style={{ padding:"12px 16px", borderRadius:12, background:maintenance?"rgba(239,68,68,0.08)":"rgba(34,197,94,0.08)", border:`1px solid ${maintenance?"rgba(239,68,68,0.2)":"rgba(34,197,94,0.2)"}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div className="flex items-center gap-2">
                        <span style={{ width:8, height:8, borderRadius:"50%", background:maintenance?"#ef4444":"#22c55e" }} />
                        <span className="font-mono text-xs" style={{ color:maintenance?"#fca5a5":"#86efac" }}>
                          Site is {maintenance ? "UNDER MAINTENANCE" : "LIVE"}
                        </span>
                      </div>
                      <button onClick={() => toggleMaintenance()}
                        style={{ position:"relative", width:44, height:24, borderRadius:999, background:maintenance?"#ef4444":"rgba(255,255,255,0.1)", border:"none", cursor:"pointer", transition:"background 0.2s" }}>
                        <span style={{ position:"absolute", top:3, width:18, height:18, borderRadius:"50%", background:"#fff", transition:"left 0.2s", left:maintenance?23:3 }} />
                      </button>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare style={{ width:13, height:13, color:"rgba(255,255,255,0.3)" }} />
                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Maintenance Message</span>
                      </div>
                      <textarea value={msgDraft} onChange={e => setMsgDraft(e.target.value)} rows={3}
                        className="w-full rounded-xl px-4 py-3 text-xs text-white font-mono outline-none resize-none"
                        style={inputStyle} />
                      <button onClick={handleSaveMsg}
                        className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl font-mono text-xs transition-all"
                        style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", color:saved?"#86efac":"rgba(255,255,255,0.5)" }}>
                        {saved ? <><Check style={{ width:12, height:12 }} /> Saved</> : "Save Message"}
                      </button>
                    </div>
                  </div>
                )}

                {tab === "users" && <UsersList />}

                {/* Logout */}
                <button onClick={logout}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl font-mono text-xs transition-all mt-2"
                  style={{ border:"1px solid rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.25)" }}
                  onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}>
                  <LogOut style={{ width:12, height:12 }} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
