import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/src/lib/supabase";
import { User, Star, Tv, Search } from "lucide-react";

export default function Users() {
  const navigate = useNavigate();
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [query,   setQuery]   = useState("");

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, username, avatar_url, level, episodes_watched, created_at")
      .order("level", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (error) console.warn(error.message);
        setUsers(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = users.filter(u =>
    !query || u.username?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24" style={{ background: "#000", color: "#fff" }}>
      <div className="max-w-3xl mx-auto px-4 pt-24">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black font-mono tracking-tighter text-white mb-1">Community</h1>
          <p className="text-white/30 font-mono text-sm">{users.length} members</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm text-white font-mono outline-none placeholder:text-white/20"
            style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 }}
            onFocus={e  => e.target.style.borderColor = "rgba(255,255,255,0.3)"}
            onBlur={e   => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/25 font-mono text-sm">No users found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((u, i) => (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => navigate(`/users/${u.id}`)}
                className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.07)" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
              >
                {/* rank */}
                <span className="text-[11px] font-mono text-white/20 w-6 text-right flex-shrink-0">
                  {i + 1}
                </span>

                {/* avatar */}
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {u.avatar_url
                    ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white/20" />
                      </div>}
                </div>

                {/* name + stats */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white font-mono truncate">
                    {u.username || "Anonymous"}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-[10px] font-mono text-white/30">
                      <Star className="w-3 h-3" /> Lv {u.level || 1}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-white/30">
                      <Tv className="w-3 h-3" /> {(u.episodes_watched || 0).toLocaleString()} eps
                    </span>
                  </div>
                </div>

                {/* level badge */}
                <div className="flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}>
                  Lv {u.level || 1}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
