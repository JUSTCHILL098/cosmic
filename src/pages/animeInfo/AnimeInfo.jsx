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

function InfoItem({ label, value, isProducer = true }) {
  return (
    value && (
      <div className="text-[11px] sm:text-[14px] font-medium">
        <span className="text-white/40">{`${label}: `}</span>
        <span className="text-white/90">
          {Array.isArray(value)
            ? value.map((item, index) =>
                isProducer ? (
                  <Link
                    key={index}
                    to={`/producer/${item
                      .replace(/[^\w\s-]/g, "")
                      .split(" ")
                      .join("-")}`}
                    className="hover:text-white"
                  >
                    {item}
                    {index < value.length - 1 && ", "}
                  </Link>
                ) : (
                  <span key={index}>{item}</span>
                )
              )
            : value}
        </span>
      </div>
    )
  );
}

/* ★ CHANGED: boxed glass tags */
function Tag({ icon, text }) {
  return (
    <div className="flex items-center gap-1 px-2.5 py-1 rounded-md
      bg-white/10 backdrop-blur-md border border-white/10
      text-white text-[11px] sm:text-[13px]">
      {icon && <FontAwesomeIcon icon={icon} className="text-[11px]" />}
      <span>{text}</span>
    </div>
  );
}

function AnimeInfo({ random = false }) {
  const { language } = useLanguage();
  const { id: paramId } = useParams();
  const id = random ? null : paramId;

  const [isFull, setIsFull] = useState(false);
  const [animeInfo, setAnimeInfo] = useState(null);
  const [seasons, setSeasons] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnimeInfo = async () => {
      setLoading(true);
      try {
        const data = await getAnimeInfo(id, random);
        setSeasons(data?.seasons);
        setAnimeInfo(data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimeInfo();
    window.scrollTo({ top: 0 });
  }, [id, random]);

  if (loading) return <Loader type="animeInfo" />;
  if (error) return <Error />;
  if (!animeInfo) {
    navigate("/404-not-found-page");
    return null;
  }

  const { title, japanese_title, poster, animeInfo: info } = animeInfo;

  const tags = [
    info.tvInfo?.rating && { text: info.tvInfo.rating },
    info.tvInfo?.quality && { text: info.tvInfo.quality },
    info.tvInfo?.sub && { icon: faClosedCaptioning, text: info.tvInfo.sub },
    info.tvInfo?.dub && { icon: faMicrophone, text: info.tvInfo.dub },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-10">

        {/* HEADER */}
        <div className="flex gap-8">

          {/* ★ CHANGED: poster glow */}
          <div className="relative">
            <img
              src={poster}
              alt={title}
              className="w-[260px] rounded-2xl
                shadow-[0_0_60px_rgba(255,255,255,0.15)]"
            />
          </div>

          <div className="flex-1 space-y-4">

            <h1 className="text-4xl font-bold">
              {language === "EN" ? title : japanese_title}
            </h1>

            <div className="flex flex-wrap gap-2">
              {tags.map((t, i) => (
                <Tag key={i} icon={t.icon} text={t.text} />
              ))}
            </div>

            <p className="max-w-3xl text-white/70">
              {isFull ? info.Overview : info.Overview?.slice(0, 280)}
              {info.Overview?.length > 280 && (
                <button
                  onClick={() => setIsFull(!isFull)}
                  className="ml-2 text-white"
                >
                  {isFull ? "Show Less" : "Read More"}
                </button>
              )}
            </p>

            {/* ★ CHANGED: Watch Now button */}
            <Link
              to={`/watch/${animeInfo.id}`}
              className="inline-flex items-center gap-2
                h-10 px-8 rounded-md
                bg-white text-black font-semibold
                shadow-[0_0_24px_rgba(255,255,255,0.35)]
                hover:shadow-[0_0_32px_rgba(255,255,255,0.5)]
                transition"
            >
              <FontAwesomeIcon icon={faPlay} />
              Watch Now
            </Link>

            {/* DETAILS */}
            <div className="mt-6 grid grid-cols-2 gap-4
              bg-white/5 backdrop-blur-md rounded-xl p-5">
              <InfoItem label="Aired" value={info.Aired} isProducer={false} />
              <InfoItem label="Status" value={info.Status} isProducer={false} />
              <InfoItem label="Duration" value={info.Duration} isProducer={false} />
              <InfoItem label="MAL Score" value={info["MAL Score"]} isProducer={false} />
            </div>

          </div>
        </div>

        {/* SEASONS / VOICE / RECOMMENDATIONS — UNCHANGED */}
        {seasons?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">More Seasons</h2>
            <div className="grid grid-cols-4 gap-4">
              {seasons.map((s) => (
                <Link key={s.id} to={`/${s.id}`}>
                  <img src={s.season_poster} className="rounded-lg opacity-70 hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {animeInfo.charactersVoiceActors?.length > 0 && (
          <Voiceactor animeInfo={animeInfo} />
        )}

        {animeInfo.recommended_data?.length > 0 && (
          <CategoryCard
            label="Recommended for you"
            data={animeInfo.recommended_data}
            showViewMore={false}
          />
        )}
      </div>
    </div>
  );
}

export default AnimeInfo;
