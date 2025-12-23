import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  Play, Plus, Users, Calendar, Clock, Sparkles
} from "lucide-react";

import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import Voiceactor from "@/src/components/voiceactor/Voiceactor";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
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
    <div className="relative min-h-screen bg-[#070707] text-white selection:bg-primary selection:text-black">
      
      {/* --- HERO BANNER --- */}
      <div className="absolute top-0 left-0 w-full h-[520px] overflow-hidden">
        <img
          src={banner || poster}
          alt=""
          className="w-full h-full object-cover object-center opacity-40 scale-105 blur-[2px]"
        />
        {/* Complex Gradient to match Next.js source */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070707] via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 pt-32 md:pt-44 relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col lg:flex-row gap-12 justify-between items-end">
          
          {/* LEFT: INFO & BUTTONS */}
          <div className="flex-1 max-w-4xl space-y-6">
            {/* Meta Pills - Sharp Design */}
            <div className="flex flex-wrap gap-2">
              <Pill label={info?.Format} color="primary" />
              <Pill label={info?.Season} />
              <Pill label={`${info?.Episodes} Episodes`} />
              <Pill label={`${info?.["MAL Score"]}% Score`} color="yellow" />
            </div>

            <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase italic">
              {language === "EN" ? title : japanese_title}
            </h1>

            {/* NEXT EPISODE CARD (The "Lunar" Card Style) */}
            <div className="bg-white/[0.03] border border-white/10 backdrop-blur-md inline-block min-w-[320px]">
              <div className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Next Entry</span>
                    <span className="text-[10px] bg-primary text-black font-bold px-1">EP {parseInt(info?.Episodes || 0) + 1}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-xs font-bold">
                       <Clock className="w-3 h-3 text-primary" />
                       <span>TUE, 22:30</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-black text-primary animate-pulse">
                       <Sparkles className="w-3 h-3" />
                       <span>05D : 12H : 44M</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to={`/watch/${id}`}>
                <button className="h-11 px-8 bg-primary text-black text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:scale-105 transition-all active:scale-95 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]">
                  <Play className="w-4 h-4 fill-current" /> Watch Now
                </button>
              </Link>

              <button className="h-11 px-6 border border-white/20 bg-white/5 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-white/10 transition-all">
                <Plus className="w-4 h-4" /> Add to List
              </button>

              <button className="h-11 px-6 border border-white/20 bg-white/5 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-white/10 transition-all group">
                <Users className="w-4 h-4 group-hover:text-primary transition-colors" /> Watch Together
              </button>
            </div>
          </div>

          {/* RIGHT: POSTER (Floating Effect) */}
          <div className="hidden lg:block shrink-0 relative group">
            <div className="absolute -inset-1 bg-primary/20 blur-2xl group-hover:bg-primary/40 transition-all duration-500" />
            <img 
              src={poster} 
              className="relative w-[260px] border-2 border-white/10 shadow-2xl brightness-110" 
              alt="poster" 
            />
          </div>
        </div>

        {/* --- DETAILS SECTION --- */}
        <div className="mt-24 border-t border-white/10">
          {/* Tabs */}
          <div className="flex overflow-x-auto no-scrollbar">
            <TabBtn active={activeTab === "overview"} onClick={() => setActiveTab("overview")} label="Overview" />
            <TabBtn active={activeTab === "characters"} onClick={() => setActiveTab("characters")} label="Characters" />
            <TabBtn active={activeTab === "more"} onClick={() => setActiveTab("more")} label="Similar" />
          </div>

          <div className="py-12">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Text Side */}
                <div className="lg:col-span-2 space-y-8">
                   <div className="space-y-4">
                      <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Synopsis</h3>
                      <p className="text-white/70 leading-[1.8] text-base font-medium max-w-3xl italic">
                        {info?.Overview}
                      </p>
                   </div>
                   
                   {/* Genre Tags */}
                   <div className="flex flex-wrap gap-2">
                     {info?.Genres?.map(g => (
                       <Link key={g} to={`/genre/${g}`} className="text-[10px] font-bold uppercase border border-white/10 px-4 py-2 hover:bg-primary hover:text-black transition-all">
                          {g}
                       </Link>
                     ))}
                   </div>
                </div>

                {/* Stats Grid Side */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-10 bg-white/[0.02] p-8 border border-white/5">
                  <DetailItem label="Format" value={info?.Format} />
                  <DetailItem label="Rating" value={info?.["MAL Score"] ? `${info["MAL Score"]}%` : "N/A"} />
                  <DetailItem label="Duration" value={info?.Duration} />
                  <DetailItem label="Status" value={info?.Status} />
                  <DetailItem label="Studio" value={info?.Studios} />
                  <DetailItem label="Source" value={info?.Source} />
                  <DetailItem label="Season" value={info?.Season} />
                  <DetailItem label="Aired" value={info?.Aired} />
                </div>
              </div>
            )}

            {activeTab === "characters" && <Voiceactor animeInfo={animeInfo} />}
            {activeTab === "more" && (
              <CategoryCard label="" data={animeInfo.recommended_data} limit={8} showViewMore={false} />
            )}
          </div>
        </div>

        <div className="pb-20"></div>
      </div>
    </div>
  );
}

/* --- REUSABLE UI COMPONENTS --- */

function Pill({ label, color }) {
  if (!label) return null;
  const colors = {
    primary: "bg-primary/10 border-primary/30 text-primary",
    yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-500",
    default: "bg-white/5 border-white/10 text-white/50"
  };
  return (
    <span className={`px-2.5 py-1 border text-[10px] font-black uppercase tracking-tighter ${colors[color] || colors.default}`}>
      {label}
    </span>
  );
}

function TabBtn({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-10 py-6 text-[11px] font-black uppercase tracking-[0.25em] transition-all relative
        ${active ? "text-primary" : "text-white/30 hover:text-white/60"}`}
    >
      {label}
      {active && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary" />}
    </button>
  );
}

function DetailItem({ label, value }) {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <span className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-black block">{label}</span>
      <span className="text-sm font-bold text-white/90">{Array.isArray(value) ? value.join(", ") : value}</span>
    </div>
  );
}
