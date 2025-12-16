/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import getNextEpisodeSchedule from "@/src/utils/getNextEpisodeSchedule.utils";
import website_name from "@/src/config/website";

import { Play, Users, Calendar, Clock, Star } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import Voiceactor from "@/src/components/voiceactor/Voiceactor";

import { useLanguage } from "@/src/context/LanguageContext";
import { useMultiplayer } from "@/src/context/MultiplayerContext";

/* ----------------- INFO ITEM ----------------- */
function InfoItem({ label, value }) {
  if (!value) return null;
  return (
    <div className="text-sm">
      <span className="text-white/50">{label}: </span>
      <span className="text-white/90">{value}</span>
    </div>
  );
}

/* ----------------- MAIN ----------------- */
export default function AnimeInfo() {
  const { id } = useParams();
  const { language } = useLanguage();
  const { createRoom } = useMultiplayer();

  const [animeInfo, setAnimeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [tab, setTab] = useState("overview");
  const [nextEp, setNextEp] = useState(null);
  const [countdown, setCountdown] = useState("");

  /* FETCH DATA */
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getAnimeInfo(id);
        setAnimeInfo(res.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  /* NEXT EP */
  useEffect(() => {
    if (!animeInfo?.id) return;
    getNextEpisodeSchedule(animeInfo.id).then((res) => {
      if (res?.nextEpisodeSchedule) {
        setNextEp(new Date(res.nextEpisodeSchedule));
      }
    });
  }, [animeInfo]);

  useEffect(() => {
    if (!nextEp) return;
    const timer = setInterval(() => {
      const diff = nextEp - new Date();
      if (diff <= 0) return setCountdown("Available now");

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);

      setCountdown(`${d}d ${h}h ${m}m`);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextEp]);

  if (loading) return <Loader type="animeInfo" />;
  if (error || !animeInfo) return <Error />;

  const title =
    language === "EN"
      ? animeInfo.title
      : animeInfo.japanese_title ?? animeInfo.title;

  const info = animeInfo.animeInfo;

  /* ----------------- UI ----------------- */
  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="relative h-[520px]">
        <img
          src={animeInfo.poster}
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 pt-28 flex gap-10 max-lg:flex-col">
          {/* POSTER */}
          <img
            src={animeInfo.poster}
            className="w-[260px] rounded-xl shadow-[0_0_60px_rgba(255,255,255,0.2)] ring-1 ring-white/20"
          />

          {/* INFO */}
          <div className="flex-1">
            {/* TOP BOXES */}
            <div className="flex flex-wrap gap-3 mb-4">
              {info?.tvInfo?.rating && (
                <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-md text-xs">
                  {info.tvInfo.rating}
                </span>
              )}
              {info?.tvInfo?.showType && (
                <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-md text-xs">
                  {info.tvInfo.showType}
                </span>
              )}
              {info?.episodeCount && (
                <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-md text-xs">
                  {info.episodeCount} Episodes
                </span>
              )}
              {info?.Duration && (
                <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-md text-xs">
                  {info.Duration}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold">{title}</h1>

            {/* BUTTONS */}
            <div className="mt-6 flex gap-4">
              <Link
                to={`/watch/${animeInfo.id}`}
                className="inline-flex items-center gap-2 h-11 px-8 bg-white text-black font-semibold rounded-md shadow-[0_0_25px_rgba(255,255,255,0.35)]"
              >
                <Play className="h-5 w-5" />
                Watch Now
              </Link>

              <button
                onClick={createRoom}
                className="inline-flex items-center gap-2 h-11 px-8 bg-black/40 border border-white/30 rounded-md"
              >
                <Users className="h-5 w-5" />
                Watch Together
              </button>
            </div>

            {/* NEXT EP */}
            {countdown && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-black/50 border border-white/20 rounded-lg">
                <Calendar className="h-4 w-4" />
                <span>Next Episode in</span>
                <span className="font-semibold">{countdown}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TABS */}
      <div className="max-w-[1400px] mx-auto px-6 mt-10">
        <div className="flex gap-6 border-b border-white/10">
          {["overview", "trailer", "characters", "more"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 capitalize ${
                tab === t
                  ? "text-white border-b-2 border-white"
                  : "text-white/50"
              }`}
            >
              {t.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        {tab === "overview" && (
          <div className="mt-6 space-y-6">
            <p className="text-white/70 max-w-4xl">{info?.Overview}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/40 p-4 rounded-xl border border-white/10">
              <InfoItem label="Aired" value={info?.Aired} />
              <InfoItem label="Status" value={info?.Status} />
              <InfoItem label="Studio" value={info?.Studios} />
              <InfoItem label="Source" value={info?.Source} />
            </div>
          </div>
        )}

        {tab === "characters" && (
          <div className="mt-6">
            <Voiceactor animeInfo={animeInfo} />
          </div>
        )}

        {tab === "more" && animeInfo?.recommended_data?.length > 0 && (
          <div className="mt-6">
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
