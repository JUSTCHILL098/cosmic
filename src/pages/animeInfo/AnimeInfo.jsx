import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPlus, faUsers, faInfoCircle, faVideo, faStar } from "@fortawesome/free-solid-svg-icons";

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
    <div className="relative min-h-screen bg-[#0a0a0a] text-white">
      
      {/* ---------------- HERO / BANNER AREA ---------------- */}
      <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden">
        <img
          src={banner || poster}
          alt=""
          className="w-full h-full object-cover object-top opacity-40 scale-105"
        />
        {/* Deep Gradient Overlay to blend into background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent hidden md:block" />
      </div>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="container mx-auto px-4 -mt-[300px] md:-mt-[350px] relative z-20">
        
        {/* UPPER HEADER SECTION: Title Left, Poster Right */}
        <div className="flex flex-col lg:flex-row gap-10 items-end lg:items-center">
          
          {/* LEFT: TITLE & ACTIONS */}
          <div className="flex-1 space-y-6">
            {/* Top Minimal Pills */}
            <div className="flex flex-wrap gap-3 text-[11px] font-bold tracking-widest uppercase text-white/60">
              <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faStar} className="text-yellow-500"/> {info?.["MAL Score"]}%</span>
              <span>•</span>
              <span>{info?.Season}</span>
              <span>•</span>
              <span>{info?.Format}</span>
              <span>•</span>
              <span>{info?.Episodes} Episodes</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              {language === "EN" ? title : japanese_title}
            </h1>

            {/* Sub-genres as simple boxes */}
            <div className="flex flex-wrap gap-2">
              {info?.Genres?.map((g) => (
                <Link key={g} to={`/genre/${g}`} className="px-3 py-1 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition text-xs font-medium">
                  {g}
                </Link>
              ))}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Link to={`/watch/${id}`} className="h-12 px-10 rounded-xl bg-white text-black font-bold flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition">
                <FontAwesomeIcon icon={faPlay} /> Watch Now
              </Link>
              <button className="h-12 px-6 rounded-xl bg-white/5 border border-white/10 font-bold flex items-center gap-2 hover:bg-white/10 transition">
                <FontAwesomeIcon icon={faPlus} /> Add
              </button>
              <button className="h-12 px-6 rounded-xl bg-white/5 border border-white/10 font-bold flex items-center gap-2 hover:bg-white/10 transition">
                <FontAwesomeIcon icon={faUsers} /> Watch Together
              </button>
            </div>
          </div>

          {/* RIGHT: POSTER WITH DYNAMIC GLOW */}
          <div className="hidden lg:block relative group shrink-0">
            <div className="absolute -inset-6 rounded-[2rem] opacity-40 blur-3xl group-hover:opacity-60 transition duration-700"
                 style={{ backgroundImage: `url(${poster})`, backgroundSize: 'cover' }} />
            <img 
              src={poster} 
              className="relative w-[280px] rounded-2xl shadow-2xl border border-white/10 z-10" 
              alt="poster" 
            />
          </div>
        </div>

        {/* ---------------- DETAILS SECTION ---------------- */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Details</h2>
          
          {/* Custom Modern Tabs */}
          <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md border-b border-white/10 rounded-t-2xl overflow-x-auto">
            <TabBtn active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={faInfoCircle} label="Overview" />
            <TabBtn active={activeTab === "characters"} onClick={() => setActiveTab("characters")} icon={faUsers} label="Characters" />
            <TabBtn active={activeTab === "more"} onClick={() => setActiveTab("more")} icon={faStar} label="More Like This" />
          </div>

          {/* TAB CONTENT */}
          <div className="bg-[#0c0c0c] border-x border-b border-white/10 rounded-b-2xl p-6 md:p-10">
            {activeTab === "overview" && (
              <div className="animate-in fade-in duration-500">
                {/* Stats Grid Above Description */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10 pb-10 border-b border-white/5">
                  <DetailItem label="Format" value={info?.Format} />
                  <DetailItem label="Episodes" value={info?.Episodes} />
                  <DetailItem label="Duration" value={info?.Duration} />
                  <DetailItem label="Score" value={info?.["MAL Score"] + "%"} />
                  <DetailItem label="Status" value={info?.Status} />
                  <DetailItem label="Studio" value={info?.Studios} />
                  <DetailItem label="Source" value={info?.Source} />
                  <DetailItem label="Season" value={info?.Season} />
                </div>

                <p className="text-white/60 leading-relaxed text-lg max-w-4xl">
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

        {/* RECENT / FOOTER SPACING */}
        <div className="pb-20"></div>
      </div>
    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function TabBtn({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-8 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap
        ${active ? "border-white text-white bg-white/5" : "border-transparent text-white/30 hover:text-white"}`}
    >
      <FontAwesomeIcon icon={icon} className="text-xs" />
      {label}
    </button>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-bold">{label}</span>
      <span className="text-sm font-semibold text-white/90">{value || "—"}</span>
    </div>
  );
}
