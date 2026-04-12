import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Star, Clock, User, ExternalLink } from "lucide-react";
import { getChapterInfo } from "@/src/utils/manga.utils";
import { useLanguage } from "@/src/context/LanguageContext";

export default function MangaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    getChapterInfo(decodeURIComponent(id))
      .then(d => setData(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#000" }}>
      <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#000" }}>
      <p className="text-white/30 font-mono text-sm">Failed to load manga</p>
      <button onClick={() => navigate("/manga")} className="text-white/50 hover:text-white font-mono text-xs underline">← Back to Manga</button>
    </div>
  );

        const manga    = data?.manga || data;
        const chapters = data?.chapters || manga?.chapters || [];
        const title    = language === "EN" ? manga.title : (manga.japanese_title || manga.title);

  return (
    <div className="min-h-screen pb-24" style={{ background: "#000", color: "#fff" }}>
      <div className="max-w-4xl mx-auto px-4 pt-20">

        {/* Back */}
        <button onClick={() => navigate("/manga")}
          className="flex items-center gap-1.5 text-white/30 hover:text-white font-mono text-xs mb-6 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Manga
        </button>

        {/* Hero */}
        <div className="flex gap-6 mb-8 max-[600px]:flex-col">
          <div className="flex-shrink-0">
            <img
              src={manga.image || manga.thumbnail}
              alt={manga.title}
              className="w-[160px] h-[240px] object-cover rounded-xl shadow-2xl"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              onError={e => { e.target.src = "https://placehold.co/160x240/111/444?text=No+Image"; }}
            />
          </div>
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <h1 className="text-2xl font-black font-mono tracking-tighter text-white leading-tight">{title}</h1>

            {/* Meta pills */}
            <div className="flex flex-wrap gap-2">
              {manga.author && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono"
                  style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)" }}>
                  <User className="w-3 h-3" />{manga.author}
                </span>
              )}
              {manga.status && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono"
                  style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)" }}>
                  <Clock className="w-3 h-3" />{manga.status}
                </span>
              )}
              {manga.rating && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono"
                  style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)" }}>
                  <Star className="w-3 h-3" />{manga.rating}
                </span>
              )}
            </div>

            {/* Genres */}
            {manga.genres?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {manga.genres.map((g, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-mono"
                    style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.4)" }}>
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Summary */}
            {manga.summary && (
              <p className="text-sm text-white/40 font-mono leading-relaxed line-clamp-4">{manga.summary}</p>
            )}
          </div>
        </div>

        {/* Chapters */}
        <div className="rounded-xl overflow-hidden" style={{ background:"#0f0f0f", border:"1px solid rgba(255,255,255,0.08)" }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Chapters
            </span>
            <span className="text-[10px] font-mono text-white/20">{chapters.length} total</span>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {chapters.length === 0 ? (
              <div className="flex flex-col items-center text-center gap-3 py-8 px-4">
                <p className="text-white/20 font-mono text-xs">Chapter list not available via our source</p>
                {manga.malUrl && (
                  <a href={manga.malUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-mono transition-colors"
                    style={{ color:"rgba(255,255,255,0.4)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
                    <ExternalLink className="w-3 h-3" /> View on MyAnimeList →
                  </a>
                )}
              </div>
            ) : (
              chapters.map((ch, i) => (
                <motion.button
                  key={ch.id || ch.chapterID || i}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.01 }}
                  onClick={() => navigate(`/manga/${encodeURIComponent(id)}/chapter/${encodeURIComponent(ch.id || ch.chapterID)}`)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left transition-all"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span className="text-sm text-white/70 font-mono">{ch.title || ch.chapterTitle || `Chapter ${i + 1}`}</span>
                  {ch.date && <span className="text-[10px] text-white/20 font-mono flex-shrink-0 ml-4">{ch.date}</span>}
                </motion.button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
