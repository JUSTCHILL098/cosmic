import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  Play, Plus, Users, Calendar, Clock, Sparkles, Star, Film, Video, ChevronRight, Info, Share2
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

  const { title, japanese_title, poster, banner, animeInfo: info, recommended_data } = animeInfo;

  return (
    <div className="relative min-h-screen bg-[#070707] text-white selection:bg-primary selection:text-black font-mono">
      
      {/* --- HERO BANNER --- */}
      <div className="absolute top-0 left-0 w-full h-[580px] overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#070707] via-[#070707]/70 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#070707] via-transparent to-[#070707]/30" />
        <img
          src={banner || poster}
          alt=""
          className="w-full h-full object-cover object-top opacity-50 scale-105 blur-[1px]"
        />
      </div>

      <main className="container mx-auto px-4 pt-32 md:pt-48 relative z-20 pb-20">
        
        {/* --- HEADER SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* LEFT: INFO & BUTTONS */}
          <div className="lg:col-span-9 space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <HeroBadge icon={<Star className="h-3 w-3 fill-primary text-primary" />} label={`${info?.["MAL Score"]}%`} color="bg-primary/10 text-primary border-primary/20" />
              <HeroBadge icon={<Calendar className="h-3 w-3" />} label={info?.Season?.split(" ")[1] || "2025"} />
              <HeroBadge icon={<Film className="h-3 w-3" />} label={info?.Format} />
              <HeroBadge icon={<Video className="h-3 w-3" />} label={`${info?.Episodes} Episodes`} />
            </div>

            <div className="space-y-2">
               <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase italic text-white drop-shadow-2xl">
                 {language === "EN" ? title : japanese_title}
               </h1>
               <p className="text-white/40 text-sm font-light tracking-[0.2em] uppercase">{japanese_title}</p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to={`/watch/${id}`} className="w-full sm:w-auto">
                <button className="h-12 w-full sm:w-auto px-10 bg-primary text-black text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)] transition-all active:scale-95">
                  <Play className="w-4 h-4 fill-current" /> Watch Now
                </button>
              </Link>

              <button className="h-12 px-8 border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white/10 transition-all">
                <Plus className="w-4 h-4" /> Add to List
              </button>

              <button className="h-12 px-8 border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white/10 transition-all group">
                <Users className="w-4 h-4 group-hover:text-primary animate-pulse" /> Watch Together
              </button>
            </div>
          </div>

          {/* RIGHT: POSTER CARD */}
          <div className="hidden lg:flex lg:col-span-3 justify-end items-start">
             <div className="relative w-full max-w-[280px] group">
                <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <img src={poster} className="w-full aspect-[2/3] object-cover" alt="poster" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-5">
                       <div className="flex justify-between items-end">
                          <div>
                             <p className="text-[10px] text-white/50 uppercase font-black">Duration</p>
                             <p className="text-lg font-bold">{info?.Duration || "24 min"}</p>
                          </div>
                          <Sparkles className="text-primary h-6 w-6 animate-pulse" />
                       </div>
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* --- DETAILS SECTION --- */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-4">
             <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Details</h2>
                <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Explore entry technicals</p>
             </div>
             <button className="p-3 rounded-full border border-white/10 bg-white/5 hover:text-primary transition-colors">
                <Share2 className="w-4 h-4" />
             </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-white/5 border border-white/10 p-1 backdrop-blur-md">
            <TabBtn active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={<Info className="w-3.5 h-3.5" />} label="Overview" />
            <TabBtn active={activeTab === "characters"} onClick={() => setActiveTab("characters")} icon={<Users className="w-3.5 h-3.5" />} label="Characters" />
            <TabBtn active={activeTab === "more"} onClick={() => setActiveTab("more")} icon={<Star className="w-3.5 h-3.5" />} label="More Like This" />
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-6 md:p-10">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-500">
                
                {/* Text Side */}
                <div className="lg:col-span-8 space-y-10">
                   <div className="space-y-4">
                      <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Synopsis</h3>
                      <p className="text-white/60 leading-relaxed text-base font-medium max-w-4xl border-l-2 border-primary/20 pl-6">
                        {info?.Overview}
                      </p>
                   </div>

                   {/* Relations Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <RelationSection title="Related Anime" items={[
                        { name: "Tomoshibi", type: "other", link: "#" },
                        { name: "Gachiakuta 2nd Season", type: "sequel", link: "#", color: "text-emerald-400" }
                      ]} />
                      <RelationSection title="Related Manga" items={[
                        { name: "Gachiakuta", type: "adaptation", link: "#", color: "text-amber-400", sub: "MANGA" }
                      ]} />
                   </div>
                </div>

                {/* Stats Side Grid */}
                <div className="lg:col-span-4">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-8 bg-black/40 p-6 border border-white/5">
                    <DetailItem label="Format" value={info?.Format} />
                    <DetailItem label="Episodes" value={info?.Episodes} />
                    <DetailItem label="Duration" value={info?.Duration} />
                    <DetailItem label="Score" value={`${info?.["MAL Score"]}%`} />
                    <DetailItem label="Status" value={info?.Status} />
                    <DetailItem label="Studio" value={info?.Studios} />
                    <DetailItem label="Source" value={info?.Source} />
                    <DetailItem label="Season" value={info?.Season} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "characters" && <Voiceactor animeInfo={animeInfo} />}
            {activeTab === "more" && (
              <CategoryCard label="" data={recommended_data} limit={8} showViewMore={false} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* --- HELPERS --- */

function HeroBadge({ icon, label, color = "bg-white/5 text-white/80" }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black backdrop-blur-md border border-white/5 ${color}`}>
      {icon}
      <span className="tracking-tighter uppercase">{label}</span>
    </div>
  );
}

function TabBtn({ active, onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-[0.1em] transition-all
        ${active ? "bg-white text-black" : "text-white/40 hover:text-white"}`}
    >
      {icon}
      {label}
    </button>
  );
}

function RelationSection({ title, items }) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] uppercase tracking-widest text-white/30 font-black">{title}</h3>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <Link key={i} to={item.link} className="flex items-center gap-2 p-2 hover:bg-white/5 transition-colors group">
            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-transform group-hover:translate-x-1" />
            <span className="text-sm font-bold text-white/70 group-hover:text-white flex-1">{item.name}</span>
            <span className={`text-[9px] px-2 py-0.5 rounded border border-current/20 bg-current/5 font-black uppercase ${item.color || "text-white/40"}`}>
              {item.type}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] uppercase tracking-widest text-white/20 font-black">{label}</span>
      <span className="text-xs font-bold text-white/90">{Array.isArray(value) ? value.join(", ") : value}</span>
    </div>
  );
}
