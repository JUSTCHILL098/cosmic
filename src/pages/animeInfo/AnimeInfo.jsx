import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import website_name from "@/src/config/website";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import Sidecard from "@/src/components/sidecard/Sidecard";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import { useLanguage } from "@/src/context/LanguageContext";
import { useHomeInfo } from "@/src/context/HomeInfoContext";
import Voiceactor from "@/src/components/voiceactor/Voiceactor";

/* ---------- helpers ---------- */

function InfoItem({ label, value, isProducer = true }) {
  return (
    value && (
      <div className="text-[12px] sm:text-[14px]">
        <span className="text-white/50">{label}: </span>
        <span className="text-white/90">
          {Array.isArray(value)
            ? value.join(", ")
            : value}
        </span>
      </div>
    )
  );
}

const GENRE_COLORS = [
  "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "bg-red-500/10 text-red-400 border-red-500/20",
  "bg-green-500/10 text-green-400 border-green-500/20",
  "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "bg-orange-500/10 text-orange-400 border-orange-500/20",
];

export default function AnimeInfo({ random = false }) {
  const { language } = useLanguage();
  const { id: paramId } = useParams();
  const id = random ? null : paramId;
  const navigate = useNavigate();

  const [animeInfo, setAnimeInfo] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAnimeInfo(id, random);
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
  }, [id, random]);

  useEffect(() => {
    if (animeInfo) {
      document.title = `Watch ${animeInfo.title} on ${website_name}`;
    }
    return () => {
      document.title = website_name;
    };
  }, [animeInfo]);

  if (loading) return <Loader type="animeInfo" />;
  if (error || !animeInfo) return <Error />;

  const { title, japanese_title, poster, animeInfo: info } = animeInfo;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* spacing so navbar never overlaps */}
      <div className="mt-[96px] max-md:mt-[72px] container mx-auto px-4">

        {/* ---------- HEADER ---------- */}
        <div className="flex gap-6 max-md:flex-col">

          {/* Poster */}
          <div className="w-[220px] max-md:w-[140px] shrink-0">
            <img
              src={poster}
              alt={title}
              className="rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.7)]"
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold">
                {language === "EN" ? title : japanese_title}
              </h1>
              {language === "EN" && japanese_title && (
                <p className="text-white/50 text-sm">{japanese_title}</p>
              )}
            </div>

            {/* Top badges */}
            <div className="flex flex-wrap gap-2">
              {info?.tvInfo?.rating && (
                <span className="px-2 py-0.5 border border-white/20 rounded-md text-xs">
                  {info.tvInfo.rating}
                </span>
              )}
              {info?.tvInfo?.quality && (
                <span className="px-2 py-0.5 border border-white/20 rounded-md text-xs">
                  {info.tvInfo.quality}
                </span>
              )}
              {info?.tvInfo?.sub && (
                <span className="px-2 py-0.5 border border-white/20 rounded-md text-xs">
                  CC {info.tvInfo.sub}
                </span>
              )}
              {info?.tvInfo?.dub && (
                <span className="px-2 py-0.5 border border-white/20 rounded-md text-xs">
                  DUB {info.tvInfo.dub}
                </span>
              )}
            </div>

            {/* Overview */}
            {info?.Overview && (
              <p className="text-white/70 max-w-3xl">
                {isFull ? info.Overview : info.Overview.slice(0, 260) + "..."}
                {info.Overview.length > 260 && (
                  <button
                    className="ml-2 text-white underline"
                    onClick={() => setIsFull(!isFull)}
                  >
                    {isFull ? "Show Less" : "Read More"}
                  </button>
                )}
              </p>
            )}

            {/* Watch Button */}
            <Link
              to={`/watch/${animeInfo.id}`}
              className="
                inline-flex items-center gap-2
                h-10 px-8
                bg-white text-black
                rounded-md font-medium
                shadow-[0_4px_20px_rgba(255,255,255,0.12)]
              "
            >
              <FontAwesomeIcon icon={faPlay} />
              Watch Now
            </Link>

            {/* Details */}
            <div className="mt-6 p-4 rounded-xl bg-black border border-white/10 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <InfoItem label="Aired" value={info?.Aired} isProducer={false} />
                <InfoItem label="Status" value={info?.Status} isProducer={false} />
                <InfoItem label="Duration" value={info?.Duration} isProducer={false} />
                <InfoItem label="MAL Score" value={info?.["MAL Score"]} isProducer={false} />
              </div>

              {/* Genres */}
              {info?.Genres && (
                <div>
                  <p className="text-white/50 text-sm mb-2">Genres</p>
                  <div className="flex flex-wrap gap-2">
                    {info.Genres.map((g, i) => (
                      <Link
                        key={g}
                        to={`/genre/${g}`}
                        className={`px-3 py-1 text-xs rounded-md border backdrop-blur-md ${GENRE_COLORS[i % GENRE_COLORS.length]}`}
                      >
                        {g}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Studios / Producers */}
              <div className="pt-3 border-t border-white/10 space-y-1">
                <InfoItem label="Studios" value={info?.Studios} />
                <InfoItem label="Producers" value={info?.Producers} />
              </div>
            </div>
          </div>
        </div>

        {/* Seasons */}
        {seasons.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">More Seasons</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {seasons.map((s) => (
                <Link key={s.id} to={`/${s.id}`} className="relative rounded-lg overflow-hidden">
                  <img src={s.season_poster} className="opacity-40" />
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                    {s.season}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Voice Actors */}
        {animeInfo?.charactersVoiceActors?.length > 0 && (
          <div className="mt-12">
            <Voiceactor animeInfo={animeInfo} />
          </div>
        )}

        {/* Recommended */}
        {animeInfo?.recommended_data?.length > 0 && (
          <div className="mt-12">
            <CategoryCard
              label="Recommended for you"
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
