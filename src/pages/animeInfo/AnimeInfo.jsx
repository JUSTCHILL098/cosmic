import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  Play, 
  Plus, 
  Users, 
  Info, 
  Star, 
  Calendar, 
  Clock, 
  Sparkles,
  ChevronRight 
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
    <div className="relative min-h-screen bg-[#070707] text-white">
      
      {/* --- HERO BANNER --- */}
      <div className="absolute top-0 left-0 w-full h-[480px] overflow-hidden">
        <img
          src={banner || poster}
          alt=""
          className="w-full h-full object-cover object-top opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 pt-28 md:pt-36 relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-start">
          
          {/* LEFT: INFO & BUTTONS */}
          <div className="flex-1 max-w-3xl space-y-5">
            {/* Meta Pills */}
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-wider rounded-sm">
                {info?.Format}
              </span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 uppercase tracking-wider rounded-sm">
                {info?.Season}
              </span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 uppercase tracking-wider rounded-sm">
                {info?.Episodes} Episodes
              </span>
              <span className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-bold text-yellow-500 uppercase tracking-wider rounded-sm">
                {info?.["MAL Score"]}% Score
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none uppercase">
              {language === "EN" ? title : japanese_title}
            </h1>

            {/* NEXT EPISODE CARD (Your exact HTML structure) */}
            <div className="bg-white/5 border border-white/10 rounded-none max-w-md">
              <div className="p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-9 h-9 rounded-none bg-primary/5 flex items-center justify-center border border-primary/10">
                      <Calendar className="h-4 w-4 text-primary/70" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="text-sm font-semibold text-white whitespace-nowrap">Next Episode</h3>
                      <div className="inline-flex items-center border font-semibold text-[10px] bg-primary/10 text-primary border-primary/20 px-1.5 py-0.5 rounded-none">
                        Ep {parseInt(info?.Episodes || 0) + 1}
                      </div>
                    </div>
                    <p className="text-xs text-white/40 mb-1 line-clamp-1">Estimated Release Schedule</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-white/40 whitespace-nowrap">
                        <Clock className="h-3 w-3 text-primary/60" />
                        <span>Dec 23, 2025</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-xs whitespace-nowrap">
                        <Sparkles className="h-3 w-3 text-primary/60" />
                        <span className="text-xs font-semibold text-primary">6d 02:30:44</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS (Sharp Corners, Small Height) */}
            <div className="flex flex-wrap md:flex-nowrap gap-3 pt-2">
              <Link to={`/watch/${id}`} className="w-full md:w-auto">
                <button className="h-9 px-6 bg-white text-black text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/90 transition-all rounded-none shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  <Play className="w-3 h-3 fill-current" /> Watch Now
                </button>
              </Link>

              <button className="h-9 px-6 border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:border-primary/50 hover:bg-white/10 transition-all rounded-none">
                <Plus className="w-3 h-3" /> Add to List
              </button>

              <button className="h-9 px-6 border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:border-primary/50 hover:bg-white/10 transition-all rounded-none">
                <Users className="w-3 h-3" /> Watch Together
              </button>
            </div>
          </div>

          {/* RIGHT: POSTER (Moved in from the edge) */}
          <div className="hidden lg:block lg:mr-12 shrink-0 relative">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-30" />
            <img 
              src={poster} 
              className="relative w-[220px] border border-white/10 brightness-110 shadow-2xl rounded-none" 
              alt="poster" 
            />
          </div>
        </div>

        {/* --- DETAILS SECTION (No Shadow) --- */}
        <div className="mt-16">
          {/* Tabs */}
          <div className="flex items-center bg-white/5 border-b border-white/10">
            <TabBtn active={activeTab === "overview"} onClick={() => setActiveTab("overview")} label="Overview" />
            <TabBtn active={activeTab === "characters"} onClick={() => setActiveTab("characters")} label="Characters" />
            <TabBtn active={activeTab === "more"} onClick={() => setActiveTab("more")} label="Recommendations" />
          </div>

          <div className="bg-transparent py-8">
            {activeTab === "overview" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Sharp Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-12">
                  <DetailItem label="Format" value={info?.Format} />
                  <DetailItem label="Episodes" value={info?.Episodes} />
                  <DetailItem label="Duration" value={info?.Duration} />
                  <DetailItem label="Score" value={info?.["MAL Score"] ? `${info["MAL Score"]}%` : "N/A"} />
                  <DetailItem label="Status" value={info?.Status} />
                  <DetailItem label="Studio" value={info?.Studios} />
                  <DetailItem label="Source" value={info?.Source} />
                  <DetailItem label="Season" value={info?.Season} />
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                   {info?.Genres?.map(g => (
                     <Link key={g} to={`/genre/${g}`} className="text-[10px] font-bold uppercase border border-white/10 px-2 py-1 hover:bg-white/5">
                        {g}
                     </Link>
                   ))}
                </div>

                <p className="text-white/50 leading-relaxed text-sm max-w-4xl border-l-2 border-primary/30 pl-6">
                  {info?.Overview}
                </p>
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

/* --- HELPERS --- */

function TabBtn({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 
        ${active ? "border-primary text-white bg-primary/5" : "border-transparent text-white/30 hover:text-white/60"}`}
    >
      {label}
    </button>
  );
}

function DetailItem({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] uppercase tracking-[0.25em] text-white/20 font-extrabold">{label}</span>
      <span className="text-xs font-bold text-white/80">{Array.isArray(value) ? value.join(", ") : value}</span>
    </div>
  );
}
