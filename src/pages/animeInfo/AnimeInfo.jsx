import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  Play, 
  Plus, 
  Users, 
  Info, 
  Star, 
  Calendar, 
  Film, 
  Video, 
  ChevronRight 
} from "lucide-react";

import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import website_name from "@/src/config/website";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import Voiceactor from "@/src/components/voiceactor/Voiceactor";
import { useLanguage } from "@/src/context/LanguageContext";

export default function AnimeInfo() {
  const { id } = useParams();
  const { language } = useLanguage();

  const [animeInfo, setAnimeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAnimeInfo(id);
        setAnimeInfo(data.data);
      } catch { setError(true); } 
      finally { setLoading(false); }
    }
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <Loader type="animeInfo" />;
  if (error || !animeInfo) return <Error />;

  const { title, japanese_title, poster, banner, animeInfo: info } = animeInfo;

  return (
    <div className="relative min-h-screen bg-[#070707] text-white selection:bg-white/20">
      
      {/* ---------------- HERO BANNER (Tidy & Faded) ---------------- */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden">
        <img
          src={banner || poster}
          alt=""
          className="w-full h-full object-cover object-top opacity-30 scale-105 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 pt-32 md:pt-44 relative z-10">
        
        {/* ---------------- HEADER: Tidy Left, Poster Right ---------------- */}
        <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-between">
          
          {/* LEFT CONTENT (Small & Tidy) */}
          <div className="flex-1 max-w-2xl">
            {/* Minimal Pills Row */}
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-3">
              <span className="flex items-center gap-1.5 text-white/70">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {info?.["MAL Score"]}%
              </span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {info?.Season}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Film className="w-3 h-3"/> {info?.Format}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Video className="w-3 h-3"/> {info?.Episodes} EPS</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] mb-2">
              {language === "EN" ? title : japanese_title}
            </h1>
            
            {/* Genre Boxes (Small) */}
            <div className="flex flex-wrap gap-1.5 mb-8">
              {info?.Genres?.map((g) => (
                <Link key={g} to={`/genre/${g}`} className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-semibold text-white/60 hover:text-white transition">
                  {g}
                </Link>
              ))}
            </div>

            {/* ACTION BUTTONS (Big & Glowing) */}
            <div className="flex flex-wrap gap-4 items-center">
              <Link to={`/watch/${id}`} className="group relative">
                {/* Persistent Glow for Watch Now */}
                <div className="absolute -inset-1 bg-white/20 blur-xl rounded-xl opacity-100 group-hover:bg-white/40 transition duration-500" />
                <button className="relative h-12 px-10 rounded-xl bg-white text-black font-bold flex items-center gap-3 shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all">
                  <Play className="w-4 h-4 fill-current" /> Watch Now
                </button>
              </Link>

              <button className="h-12 px-6 rounded-xl bg-white/5 border border-white/10 font-bold flex items-center gap-2 hover:bg-white/10 transition group">
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Add
              </button>

              <button className="h-12 px-6 rounded-xl bg-white/5 border border-white/10 font-bold flex items-center gap-2 hover:bg-white/10 transition">
                <Users className="w-4 h-4" /> Watch Together
              </button>
            </div>
          </div>

          {/* RIGHT POSTER (With Persistent Poster Glow) */}
          <div className="hidden lg:block relative shrink-0">
            {/* Image-based persistent glow */}
            <div className="absolute -inset-8 opacity-50 blur-[60px] pointer-events-none scale-110">
               <img src={poster} alt="" className="w-full h-full object-cover rounded-full" />
            </div>
            <img 
              src={poster} 
              className="relative w-[240px] rounded-2xl shadow-2xl border border-white/10 z-10 brightness-110" 
              alt="poster" 
            />
          </div>
        </div>

        {/* ---------------- DETAILS SECTION ---------------- */}
        <div className="mt-20 lg:mt-32">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              Details <ChevronRight className="w-4 h-4 text-white/20" />
            </h2>
          </div>
          
          {/* Tab List (Tidy) */}
          <div role="tablist" className="flex items-center gap-1 bg-white/5 backdrop-blur-xl border-b border-white/10 rounded-t-2xl overflow-x-auto scrollbar-hide">
            <TabBtn active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={<Info className="w-3.5 h-3.5" />} label="Overview" />
            <TabBtn active={activeTab === "characters"} onClick={() => setActiveTab("characters")} icon={<Users className="w-3.5 h-3.5" />} label="Characters" />
            <TabBtn active={activeTab === "more"} onClick={() => setActiveTab("more")} icon={<Star className="w-3.5 h-3.5" />} label="More Like This" />
          </div>

          {/* TAB CONTENT */}
          <div className="bg-[#0c0c0c]/50 backdrop-blur-md border-x border-b border-white/10 rounded-b-2xl p-6 md:p-10 transition-all">
            {activeTab === "overview" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Stats Grid Above Description */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-12 mb-10 pb-10 border-b border-white/5">
                  <DetailItem label="Format" value={info?.Format} />
                  <DetailItem label="Episodes" value={info?.Episodes} />
                  <DetailItem label="Duration" value={info?.Duration} />
                  <DetailItem label="Score" value={info?.["MAL Score"] ? `${info["MAL Score"]}%` : "N/A"} />
                  <DetailItem label="Status" value={info?.Status} />
                  <DetailItem label="Studio" value={info?.Studios} />
                  <DetailItem label="Source" value={info?.Source} />
                  <DetailItem label="Season" value={info?.Season} />
                </div>

                <p className="text-white/50 leading-relaxed text-sm md:text-base max-w-5xl">
                  {info?.Overview}
                </p>
              </div>
            )}

            {activeTab === "characters" && <Voiceactor animeInfo={animeInfo} />}
            {activeTab === "more" && (
               <CategoryCard label="" data={animeInfo.recommended_data} limit={animeInfo.recommended_data.length} showViewMore={false} />
            )}
          </div>
        </div>

        <div className="pb-24"></div>
      </div>
    </div>
  );
}

/* ---------------- UI HELPERS (Tidy) ---------------- */

function TabBtn({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap uppercase tracking-widest
        ${active ? "border-white text-white bg-white/5" : "border-transparent text-white/20 hover:text-white/50"}`}
    >
      {icon}
      {label}
    </button>
  );
}

function DetailItem({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-extrabold">{label}</span>
      <span className="text-xs font-semibold text-white/80">{Array.isArray(value) ? value.join(", ") : value}</span>
    </div>
  );
}
