import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import website_name from "@/src/config/website";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import Voiceactor from "@/src/components/voiceactor/Voiceactor";
import { useLanguage } from "@/src/context/LanguageContext";

/* ---------------- HELPERS ---------------- */

function Stat({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wider text-white/40 mb-1">
        {label}
      </span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

/* ---------------- PAGE ---------------- */

export default function AnimeInfo() {
  const { id } = useParams();
  const { language } = useLanguage();

  const [animeInfo, setAnimeInfo] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAnimeInfo(id);
        setAnimeInfo(data.data);
        setSeasons(data.seasons || []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (animeInfo) {
      document.title = `${animeInfo.title} – ${website_name}`;
    }
    return () => {
      document.title = website_name;
    };
  }, [animeInfo]);

  if (loading) return <Loader type="animeInfo" />;
  if (error || !animeInfo) return <Error />;

  const { title, japanese_title, poster, animeInfo: info } = animeInfo;

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* ---------------- HERO BACKGROUND ---------------- */}
      <div className="absolute inset-x-0 top-0 h-[520px] -z-10">
        <img
          src={poster}
          alt=""
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/80 to-black" />
      </div>

      {/* ---------------- CONTENT ---------------- */}
      <div className="pt-[96px] max-md:pt-[72px] px-4 max-w-[1400px] mx-auto">
        {/* ---------------- HEADER ---------------- */}
        <div className="flex gap-8 max-lg:flex-col-reverse">
          {/* LEFT INFO */}
          <div className="flex-1">
            {/* META ROW */}
            <div className="flex flex-wrap gap-2 mb-4">
              {info?.["MAL Score"] && (
                <span className="px-3 py-1 rounded-md bg-white/10 border border-white/20 text-sm">
                  {info["MAL Score"]}%
                </span>
              )}
              {info?.Season && (
                <span className="px-3 py-1 rounded-md bg-white/10 border border-white/20 text-sm">
                  {info.Season}
                </span>
              )}
              {info?.Format && (
                <span className="px-3 py-1 rounded-md bg-white/10 border border-white/20 text-sm">
                  {info.Format}
                </span>
              )}
              {info?.Episodes && (
                <span className="px-3 py-1 rounded-md bg-white/10 border border-white/20 text-sm">
                  {info.Episodes} Episodes
                </span>
              )}
            </div>

            {/* TITLE */}
            <h1 className="text-4xl font-bold leading-tight">
              {language === "EN" ? title : japanese_title}
            </h1>
            {japanese_title && language === "EN" && (
              <p className="text-white/50 mt-1">{japanese_title}</p>
            )}

            {/* ACTIONS */}
            <div className="mt-6 flex gap-4 flex-wrap">
              <Link
                to={`/watch/${animeInfo.id}`}
                className="
                  inline-flex items-center gap-2
                  h-11 px-8
                  bg-white text-black
                  rounded-md font-semibold
                  shadow-[0_0_40px_rgba(255,255,255,0.35)]
                  hover:shadow-[0_0_60px_rgba(255,255,255,0.55)]
                  transition
                "
              >
                <FontAwesomeIcon icon={faPlay} />
                Watch Now
              </Link>

              <button className="h-11 px-8 rounded-md bg-white/10 border border-white/20">
                Add
              </button>

              <button className="h-11 px-8 rounded-md bg-white/10 border border-white/20">
                Watch Together
              </button>
            </div>
          </div>

          {/* RIGHT POSTER */}
          <div className="relative w-[260px] max-lg:w-[180px] shrink-0 mx-auto">
            {/* glow */}
            <div
              className="absolute inset-0 rounded-xl blur-2xl opacity-60 scale-110"
              style={{
                backgroundImage: `url(${poster})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <img
              src={poster}
              alt={title}
              className="relative z-10 rounded-xl"
            />
          </div>
        </div>

        {/* ---------------- DETAILS BOX ---------------- */}
        <div className="mt-10 bg-[#0b0b0b] rounded-xl border border-white/10 p-6">
          {/* GENRES */}
          {info?.Genres && (
            <div className="flex flex-wrap gap-2 mb-6">
              {info.Genres.map((g) => (
                <Link
                  key={g}
                  to={`/genre/${g}`}
                  className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-xs"
                >
                  {g}
                </Link>
              ))}
            </div>
          )}

          {/* STATS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-4 border-t border-white/10 pt-6">
            <Stat label="Format" value={info?.Format} />
            <Stat label="Episodes" value={info?.Episodes} />
            <Stat label="Duration" value={info?.Duration} />
            <Stat label="Score" value={info?.["MAL Score"] && `${info["MAL Score"]}%`} />
            <Stat label="Status" value={info?.Status} />
            <Stat label="Studio" value={info?.Studios} />
            <Stat label="Source" value={info?.Source} />
            <Stat label="Season" value={info?.Season} />
          </div>

          {/* OVERVIEW */}
          {info?.Overview && (
            <div className="mt-6 text-white/70 leading-relaxed">
              {isFull ? info.Overview : info.Overview.slice(0, 450) + "..."}
              {info.Overview.length > 450 && (
                <button
                  className="ml-2 text-white underline"
                  onClick={() => setIsFull(!isFull)}
                >
                  {isFull ? "Show Less" : "Read More"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* VOICE ACTORS */}
        {animeInfo?.charactersVoiceActors?.length > 0 && (
          <div className="mt-14">
            <Voiceactor animeInfo={animeInfo} />
          </div>
        )}

        {/* RECOMMENDED */}
        {animeInfo?.recommended_data?.length > 0 && (
          <div className="mt-14">
            <CategoryCard
              label="More Like This"
              data={animeInfo.recommended_data}
              limit={animeInfo.recommended_data.length}
              showViewMore={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
