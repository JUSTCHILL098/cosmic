import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faInfoCircle, faUsers, faStar, faVideo } from "@fortawesome/free-solid-svg-icons";

// Your Utils & Components
import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import website_name from "@/src/config/website";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import Voiceactor from "@/src/components/voiceactor/Voiceactor";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import { useLanguage } from "@/src/context/LanguageContext";

export default function AnimeInfo() {
  const { language } = useLanguage();
  const { id } = useParams();
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

  const info = animeInfo.animeInfo;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* --- HERO BANNER --- */}
      <div className="relative h-[45vh] md:h-[65vh] w-full">
        <img 
          src={animeInfo.banner || animeInfo.poster} 
          className="w-full h-full object-cover object-top opacity-60"
          alt="background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-40 md:-mt-56 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* --- LEFT: POSTER & GLOW --- */}
          <div className="flex flex-col gap-4 w-full md:w-64 shrink-0 items-center">
            <div className="relative group">
              {/* The Glow Effect */}
              <div className="absolute -inset-4 bg-primary/30 blur-3xl rounded-full opacity-70 group-hover:opacity-100 transition duration-500" />
              <img 
                src={animeInfo.poster} 
                className="relative w-48 md:w-64 rounded-2xl shadow-2xl border border-white/10 object-cover aspect-[2/3]"
                alt={animeInfo.title}
              />
            </div>

            {/* Glowing Watch Button */}
            <Link to={`/watch/${id}`} className="w-full">
              <button className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-white text-black font-bold hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                <FontAwesomeIcon icon={faPlay} className="text-sm" />
                Watch Now
              </button>
            </Link>
          </div>

          {/* --- RIGHT: TEXT CONTENT --- */}
          <div className="flex-1 space-y-6 pt-2 md:pt-10">
            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                {language === "EN" ? animeInfo.title : animeInfo.japanese_title}
              </h1>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {info?.Genres?.map((g) => (
                  <span key={g} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[11px] font-bold uppercase tracking-wider text-white/60">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* --- TAB NAVIGATION --- */}
            <div className="mt-10">
              <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md border-b border-white/10 rounded-t-2xl overflow-x-auto no-scrollbar">
                <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={faInfoCircle} label="Overview" />
                <TabButton active={activeTab === "characters"} onClick={() => setActiveTab("characters")} icon={faUsers} label="Characters" />
                <TabButton active={activeTab === "more"} onClick={() => setActiveTab("more")} icon={faStar} label="More Like This" />
              </div>

              {/* --- TAB CONTENT: OVERVIEW --- */}
              {activeTab === "overview" && (
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-b-2xl border-x border-b border-white/10 animate-in fade-in duration-500">
                  
                  {/* Metadata Grid (The part you wanted above the text) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 pb-8 border-b border-white/5">
                    <DetailItem label="Format" value={info?.Format || "ONA"} />
                    <DetailItem label="Episodes" value={info?.Episodes || "12"} />
                    <DetailItem label="Duration" value={info?.Duration || "24 min"} />
                    <DetailItem label="Score" value={`${info?.["MAL Score"]}%` || "58%"} />
                    <DetailItem label="Status" value={info?.Status || "FINISHED"} />
                    <DetailItem label="Studio" value={info?.Studios} />
                    <DetailItem label="Source" value={info?.Source} />
                    <DetailItem label="Season" value={info?.Season || "Fall 2025"} />
                  </div>

                  <p className="text-white/70 leading-relaxed text-sm md:text-base">
                    {info?.Overview}
                  </p>
                </div>
              )}

              {/* Character Tab */}
              {activeTab === "characters" && (
                <div className="mt-6"><Voiceactor animeInfo={animeInfo} /></div>
              )}

              {/* Recommendations Tab */}
              {activeTab === "more" && animeInfo?.recommended_data?.length > 0 && (
                <div className="mt-6">
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

// Sub-components for cleaner code
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap border-b-2 
        ${active ? "border-primary text-white bg-white/5" : "border-transparent text-white/40 hover:text-white"}`}
    >
      <FontAwesomeIcon icon={icon} className="text-xs" />
      {label}
    </button>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">{label}</span>
      <span className="text-sm font-semibold text-white/90">{value || "N/A"}</span>
    </div>
  );
}
