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
        
        {/* --- TOP HEADER (Hero Section) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
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

            <div className="flex flex-wrap gap-4 pt-4">
              <Link to={`/watch/${id}`} className="w-full sm:w-auto">
                <button className="h-12 w-full sm:w-auto px-10 bg-primary text-black text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)] transition-all active:scale-95">
                  <Play className="w-4 h-4 fill-current" /> Watch Now
                </button>
              </Link>
              <button className="h-12 px-8 border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white/10 transition-all">
                <Plus className="w-4 h-4" /> Add to List
              </button>
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-3 justify-end items-start">
             <div className="relative w-full max-w-[280px] group">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <img src={poster} className="w-full aspect-[2/3] object-cover" alt="poster" />
                </div>
             </div>
          </div>
        </div>

        {/* --- DETAILS SECTION (IDENTICAL TO GACHIAKUTA TEMPLATE) --- */}
        <div className="p-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 px-4 pt-4 md:px-0 md:pt-0">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Details</h2>
              <p className="text-muted-foreground text-sm">Explore more about {title}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors border shadow-sm h-9 w-9 rounded-full border-border bg-muted/70 hover:bg-muted/70" type="button">
                <Share2 className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div dir="ltr" className="w-full">
            {/* IDENTICAL TABS */}
            <div role="tablist" className="inline-flex items-center rounded-lg text-muted-foreground w-full justify-start mb-4 bg-muted/30 backdrop-blur-sm border-b border-border rounded-t-2xl rounded-b-none h-auto p-0 gap-1 overflow-x-auto flex-nowrap whitespace-nowrap ring-1 ring-white/20">
              <TabLink active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={<Info className="h-3.5 w-3.5 mr-1.5" />} label="Overview" />
              <TabLink active={activeTab === "characters"} onClick={() => setActiveTab("characters")} icon={<Users className="h-3.5 w-3.5 mr-1.5" />} label="Characters" />
              <TabLink active={activeTab === "more"} onClick={() => setActiveTab("more")} icon={<Star className="h-3.5 w-3.5 mr-1.5" />} label="More Like This" />
            </div>

            {/* CONTENT PANEL */}
            <div className="bg-muted/30 backdrop-blur-sm rounded-b-xl rounded-tr-xl p-4 md:p-6 transition-all duration-300">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Genre Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {info?.Genre?.split(",").map((g) => (
                      <div key={g} className="inline-flex items-center rounded-md border text-xs font-semibold transition-colors bg-secondary text-secondary-foreground px-3 py-1">
                        {g.trim()}
                      </div>
                    ))}
                  </div>

                  {/* Related Anime List */}
                  <div className="mb-6 border-b border-muted/30 pb-4">
                    <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Related Content</h3>
                    <div className="flex flex-col space-y-2">
                      <RelationItem name="Gachiakuta 2nd Season" type="sequel" color="text-emerald-400 bg-emerald-400/10 border-emerald-400/20" />
                      <RelationItem name="Gachiakuta" type="adaptation" color="text-amber-400 bg-amber-400/10 border-amber-400/20" badge="MANGA" />
                    </div>
                  </div>

                  {/* IDENTICAL INFO GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-4 mt-4 border-t border-muted/30 pt-4">
                    <GridInfo label="Format" value={info?.Format} />
                    <GridInfo label="Episodes" value={info?.Episodes} />
                    <GridInfo label="Duration" value={info?.Duration} />
                    <GridInfo label="Score" value={`${info?.["MAL Score"]}%`} />
                    <GridInfo label="Status" value={info?.Status} />
                    <GridInfo label="Studio" value={info?.Studios} />
                    <GridInfo label="Source" value={info?.Source} />
                    <GridInfo label="Season" value={info?.Season} />
                  </div>

                  {/* Synopsis Text */}
                  <div className="prose prose-invert max-w-none text-muted-foreground text-base mt-6">
                    {info?.Overview}
                  </div>
                </div>
              )}

              {activeTab === "characters" && <Voiceactor animeInfo={animeInfo} />}
              {activeTab === "more" && (
                <CategoryCard label="" data={recommended_data} limit={8} showViewMore={false} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/** HELPER COMPONENTS FOR THE IDENTICAL LOOK **/

function TabLink({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center whitespace-nowrap font-medium transition-all rounded-none text-sm px-4 py-3 flex-shrink-0 
      ${active ? "bg-background text-foreground shadow border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function GridInfo({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</span>
      <span className="text-sm font-medium text-foreground">{value || "N/A"}</span>
    </div>
  );
}

function RelationItem({ name, type, color, badge }) {
  return (
    <div className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 group block">
      <div className="flex items-center gap-2">
        <ChevronRight className="w-4 h-4 flex-shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        <span className="break-words flex-1">{name}</span>
        <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 uppercase border ${color}`}>{type}</span>
        {badge && <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded flex-shrink-0">{badge}</span>}
      </div>
    </div>
  );
}

function HeroBadge({ icon, label, color = "bg-white/5 text-white/80 border-white/5" }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black backdrop-blur-md border ${color}`}>
      {icon}
      <span className="tracking-tighter uppercase">{label}</span>
    </div>
  );
}
