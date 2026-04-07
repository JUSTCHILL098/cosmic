import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/src/context/AuthContext";
import {
  User, Star, Tv, MessageSquare, Edit3, Camera,
  LogOut, Shield, Zap, Trophy, BookOpen, Clock,
  Check, ChevronRight, Activity,
} from "lucide-react";
import { supabase } from "@/src/lib/supabase";

const XP_PER_LEVEL = 500;

const BADGES = [
  { id:"rising_star",  icon:Star,      label:"Rising Star",   desc:"Reach level 5",    color:"#a78bfa", req:5   },
  { id:"enthusiast",   icon:Zap,       label:"Enthusiast",    desc:"Reach level 10",   color:"#f59e0b", req:10  },
  { id:"unbeatable",   icon:Shield,    label:"Unbeatable",    desc:"Reach level 25",   color:"#10b981", req:25  },
  { id:"warrior",      icon:Trophy,    label:"Warrior",       desc:"Reach level 50",   color:"#3b82f6", req:50  },
  { id:"elite",        icon:Trophy,    label:"Elite",         desc:"Reach level 75",   color:"#ec4899", req:75  },
  { id:"avid_watcher", icon:Tv,        label:"Avid Watcher",  desc:"Watch 250 eps",    color:"#06b6d4", eps:250 },
  { id:"regular",      icon:BookOpen,  label:"Regular Viewer",desc:"Watch 100 eps",    color:"#8b5cf6", eps:100 },
  { id:"legend",       icon:Clock,     label:"Anime Legend",  desc:"Watch 3000 eps",   color:"#f97316", eps:3000},
];

function BadgeRow({ badge, level, eps }) {
  const unlocked = badge.req ? level >= badge.req : eps >= (badge.eps || 0);
  const Icon = badge.icon;
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl transition-all"
      style={{ background: unlocked ? "rgba(255,255,255,0.04)" : "transparent", opacity: unlocked ? 1 : 0.4 }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${badge.color}18`, border: `1px solid ${badge.color}30` }}>
        <Icon className="w-3.5 h-3.5" style={{ color: unlocked ? badge.color : "rgba(255,255,255,0.2)" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono font-semibold text-white/80 truncate">{badge.label}</p>
        <p className="text-[10px] font-mono text-white/25">{badge.desc}</p>
      </div>
      {unlocked && <Check className="w-3 h-3 text-green-400 flex-shrink-0" />}
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile, loading, signOut, updateProfile } = useAuth();
  const [tab,      setTab]      = useState("overview");
  const [bio,      setBio]      = useState(profile?.bio || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [saving,   setSaving]   = useState(false);
  const avatarRef = useRef(null);
  const bannerRef = useRef(null);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
    </div>
  );

  if (!user) { navigate("/login"); return null; }

  const level   = profile?.level || 1;
  const xp      = profile?.xp || 0;
  const xpInLvl = xp % XP_PER_LEVEL;
  const xpPct   = Math.min(xpInLvl / XP_PER_LEVEL * 100, 100);
  const eps     = profile?.episodes_watched || 0;
  const unlockedBadges = BADGES.filter(b => b.req ? level >= b.req : eps >= (b.eps || 0));

  const upload = async (file, bucket, pathPrefix) => {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${pathPrefix}.${ext}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    // Store clean URL in DB (no cache-busting) so others can see it
    return data.publicUrl;
  };

  const handleAvatar = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    try {
      const url = await upload(f, "avatars", `${user.id}/avatar`);
      await updateProfile({ avatar_url: url });
      // Force re-render with cache-bust on the displayed img
      e.target.value = "";
    } catch (err) { console.error("Avatar upload failed:", err.message); }
  };

  const handleBanner = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    try {
      const url = await upload(f, "banners", `${user.id}/banner`);
      await updateProfile({ banner_url: url });
      e.target.value = "";
    } catch (err) { console.error("Banner upload failed:", err.message); }
  };

  const handleSave = async () => {
    setSaving(true);
    try { await updateProfile({ bio, username }); setTab("overview"); }
    catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: "#050505", color: "#fff" }}>

      {/* ── BANNER ── */}
      <div className="relative h-56 w-full overflow-hidden group" style={{ background: "#0a0a0a" }}>
        {profile?.banner_url
          ? <img src={`${profile.banner_url}?t=${profile.updated_at || ''}`} alt="" className="w-full h-full object-cover" />
          : <div className="w-full h-full" style={{ background: "linear-gradient(135deg,#0d0d1a 0%,#1a0a2e 50%,#0a1020 100%)" }} />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        <button onClick={() => bannerRef.current?.click()}
          className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all"
          style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "#fff" }}>
          <Camera className="w-3 h-3" /> Edit Banner
        </button>
        <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBanner} />
      </div>

      <div className="max-w-5xl mx-auto px-4">

        {/* ── AVATAR + HEADER ── */}
        <div className="flex items-end gap-4 -mt-14 mb-5 relative z-10">
          <div className="relative flex-shrink-0 group">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-[#050505]"
              style={{ background: "#111" }}>
              {profile?.avatar_url
                ? <img src={`${profile.avatar_url}?t=${profile.updated_at || ''}`} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><User className="w-10 h-10 text-white/15" /></div>}
            </div>
            <button onClick={() => avatarRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "#111", border: "1px solid rgba(255,255,255,0.2)" }}>
              <Camera className="w-3.5 h-3.5 text-white/70" />
            </button>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </div>

          <div className="flex-1 pb-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold font-mono text-white">{profile?.username || user.email?.split("@")[0]}</h1>
              <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full"
                style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#86efac" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Online
              </span>
            </div>
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              {unlockedBadges.slice(0,3).map(b => (
                <span key={b.id} className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                  style={{ background:`${b.color}15`, border:`1px solid ${b.color}30`, color:b.color }}>
                  ✦ {b.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pb-1 flex-shrink-0">
            <button onClick={() => setTab("edit")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all"
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
            <button onClick={async () => { await signOut(); navigate("/"); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all"
              style={{ background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.15)", color:"#fca5a5" }}>
              <LogOut className="w-3.5 h-3.5" /> Out
            </button>
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { icon:Star,          label:"User Level",        value:`Level ${level}` },
            { icon:Tv,            label:"Episodes Watched",  value:eps.toLocaleString() },
            { icon:MessageSquare, label:"Comments",          value:profile?.comments || 0 },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
              <s.icon className="w-4 h-4 text-white/25 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-white font-mono">{s.value}</p>
                <p className="text-[10px] text-white/25 font-mono">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── XP BAR ── */}
        <div className="p-4 rounded-xl mb-6" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-white/50 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-400" /> Level {level}
            </span>
            <span className="text-xs font-mono text-white/25">{xpInLvl} / {XP_PER_LEVEL} XP</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.06)" }}>
            <motion.div className="h-full rounded-full"
              initial={{ width:0 }} animate={{ width:`${xpPct}%` }} transition={{ duration:1, ease:"easeOut" }}
              style={{ background:"linear-gradient(90deg,#7c3aed,#a78bfa)" }} />
          </div>
          <p className="text-[10px] text-white/20 font-mono mt-1.5 text-center">
            {XP_PER_LEVEL - xpInLvl} XP to level {level+1}
          </p>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid md:grid-cols-[1fr,280px] gap-4">

          {/* LEFT */}
          <div className="flex flex-col gap-4">
            {/* tabs */}
            <div className="flex gap-1 p-1 rounded-xl" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
              {["overview","activity","edit"].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className="flex-1 py-2 rounded-lg text-xs font-mono font-semibold capitalize transition-all"
                  style={{ background:tab===t?"rgba(255,255,255,0.08)":"transparent", color:tab===t?"#fff":"rgba(255,255,255,0.3)" }}>
                  {t}
                </button>
              ))}
            </div>

            {tab === "overview" && (
              <div className="p-4 rounded-xl" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
                <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> About Me
                </h3>
                <p className="text-sm text-white/50 font-mono leading-relaxed">
                  {profile?.bio || "No bio yet. Click Edit to add one."}
                </p>
              </div>
            )}

            {tab === "activity" && (
              <div className="p-4 rounded-xl" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
                <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Activity History
                </h3>
                {/* simple activity grid placeholder */}
                <div className="flex flex-wrap gap-1">
                  {Array.from({length:52*7}).map((_,i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-sm"
                      style={{ background: Math.random() > 0.75 ? `rgba(139,92,246,${(Math.random()*0.6+0.2).toFixed(2)})` : "rgba(255,255,255,0.05)" }} />
                  ))}
                </div>
                <p className="text-[10px] text-white/20 font-mono mt-3">Episodes watched per day (last year)</p>
              </div>
            )}

            {tab === "edit" && (
              <div className="p-4 rounded-xl flex flex-col gap-4" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
                <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </h3>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Username</label>
                  <input value={username} onChange={e => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white font-mono outline-none"
                    style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Bio</label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white font-mono outline-none resize-none"
                    style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }} />
                </div>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-mono font-semibold transition-all"
                  style={{ background:"rgba(139,92,246,0.18)", border:"1px solid rgba(139,92,246,0.3)", color:"#c4b5fd" }}>
                  {saving ? <div className="w-4 h-4 border-2 border-purple-400/20 border-t-purple-400 rounded-full animate-spin" /> : <><Check className="w-4 h-4" /> Save Changes</>}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT — badges sidebar */}
          <div className="flex flex-col gap-4">
            {/* badge groups */}
            {[
              { label:"LEVEL",     badges: BADGES.filter(b => b.req) },
              { label:"WATCHING",  badges: BADGES.filter(b => b.eps) },
            ].map(group => (
              <div key={group.label} className="p-3 rounded-xl" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3" /> {group.label}
                  </span>
                  <span className="text-[10px] font-mono text-white/20">
                    {group.badges.filter(b => b.req ? level >= b.req : eps >= (b.eps||0)).length} unlocked
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  {group.badges.map(b => <BadgeRow key={b.id} badge={b} level={level} eps={eps} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
