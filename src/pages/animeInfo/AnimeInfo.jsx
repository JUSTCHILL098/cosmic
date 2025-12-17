import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Info, Video, Users, Star, Play, Heart, Calendar, Film, Clock } from "lucide-react";

// Your existing utils/components
import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import getNextEpisodeSchedule from "@/src/utils/getNextEpisodeSchedule.utils";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import Voiceactor from "@/src/components/voiceactor/Voiceactor";
import CategoryCard from "@/src/components/categorycard/CategoryCard";

export default function AnimeInfo() {
  const { id } = useParams();
  const [animeInfo, setAnimeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAnimeInfo(id);
        setAnimeInfo(data.data);
      } catch (e) { console.error(e); } 
      finally { setLoading(false); }
    }
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <Loader type="animeInfo" />;
  if (!animeInfo) return <Error />;

  const info = animeInfo.animeInfo;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary/30">
      {/* HERO SECTION */}
      <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
        <img 
          src={animeInfo.banner || animeInfo.poster} 
          className="w-full h-full object-cover object-top scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* POSTER WITH GLOW */}
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="relative group w-48 md:w-64">
              <div className="absolute -inset-1 bg-primary/40 blur-2xl rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500" />
              <img 
                src={animeInfo.poster} 
                className="relative rounded-xl shadow-2xl border border-white/10 w-full object-cover aspect-[2/3]"
              />
            </div>
            
            <Link to={`/watch/${animeInfo.id}`} className="mt-6 block">
              <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all h-11 rounded-lg px-8 gap-2 bg-[#ffbade] hover:bg-[#ffbade]/90 text-black shadow-lg shadow-[#ffbade]/20 w-full">
                <Play className="h-4 w-4 fill-current" />
                Watch Now
              </button>
            </Link>
          </div>

          {/* MAIN INFO */}
          <div className="flex-1 pt-4 md:pt-32">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-center md:text-left">
              {animeInfo.title}
            </h1>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
              {info?.Genres?.slice(0, 4).map((g) => (
                <span key={g} className="px-3 py-1 text-[11px] font-bold uppercase tracking-widest rounded-full bg-white/5 border border-white/10 text-white/70">
                  {g}
                </span>
              ))}
            </div>

            {/* TAB SYSTEM (Modern Scrollable) */}
            <div className="mt-8">
              <div role="tablist" className="inline-flex items-center rounded-t-2xl text-muted-foreground w-full justify-start bg-white/5 backdrop-blur-md border-b border-white/10 h-auto p-0 gap-1 overflow-x-auto flex-nowrap whitespace-nowrap ring-1 ring-white/10">
                <ModernTab 
                  active={activeTab === "overview"} 
                  onClick={() => setActiveTab("overview")} 
                  icon={<Info className="h-3.5 w-3.5" />} 
                  label="Overview" 
                />
                <ModernTab 
                  active={activeTab === "characters"} 
                  onClick={() => setActiveTab("characters")} 
                  icon={<Users className="h-3.5 w-3.5" />} 
                  label="Characters" 
                />
                <ModernTab 
                  active={activeTab === "more"} 
                  onClick={() => setActiveTab("more")} 
                  icon={<Star className="h-3.5 w-3.5" />} 
                  label="Recommendations" 
                />
              </div>

              {/* TAB CONTENT: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="p-6 bg-white/5 backdrop-blur-sm rounded-b-2xl border-x border-b border-white/10 animate-in fade-in duration-300">
                  <p className="text-white/70 leading-relaxed text-sm md:text-base line-clamp-4 md:line-clamp-none">
                    {info?.Overview}
                  </p>
                  
                  {/* GRID DETAILS (Your Requested Design) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-6 mt-8 border-t border-white/10 pt-6">
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
              )}

              {/* OTHER TABS */}
              {activeTab === "characters" && <div className="mt-4"><Voiceactor animeInfo={animeInfo} /></div>}
              {activeTab === "more" && (
                <div className="mt-4">
                  <CategoryCard label="Recommended" data={animeInfo.recommended_data} showViewMore={false} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// HELPER COMPONENTS
function ModernTab({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center whitespace-nowrap font-medium transition-all px-6 py-4 text-sm flex-shrink-0 gap-2 border-b-2
        ${active 
          ? "bg-white/10 text-white border-[#ffbade]" 
          : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"}`}
    >
      {icon}
      {label}
    </button>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1 font-bold">
        {label}
      </span>
      <span className="text-sm font-medium text-white/90">
        {value || "N/A"}
      </span>
    </div>
  );
}
