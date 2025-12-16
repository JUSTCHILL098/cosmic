import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Play,
  Plus,
  Users,
  Share2,
  Star
} from "lucide-react";

import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import getNextEpisodeSchedule from "@/src/utils/getNextEpisodeSchedule.utils";

import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import Voiceactor from "@/src/components/voiceactor/Voiceactor";

import { useLanguage } from "@/src/context/LanguageContext";
import { useMultiplayer } from "@/src/context/MultiplayerContext";
import website_name from "@/src/config/website";

/* ---------- helpers ---------- */

const GENRE_STYLE =
  "text-xs px-2 py-0.5 rounded uppercase font-semibold border";

export default function AnimeInfo() {
  const { id } = useParams();
  const { language } = useLanguage();
  const { createRoom } = useMultiplayer();

  const [animeInfo, setAnimeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState("overview");
  const [nextEp, setNextEp] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const data = await getAnimeInfo(id);
        setAnimeInfo(data.data);

        const schedule = await getNextEpisodeSchedule(id);
        setNextEp(schedule);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (animeInfo) {
      document.title = `Watch ${animeInfo.title} on ${website_name}`;
    }
    return () => (document.title = website_name);
  }, [animeInfo]);

  if (loading) return <Loader type="animeInfo" />;
  if (error || !animeInfo) return <Error />;

  const {
    title,
    japanese_title,
    poster,
    animeInfo: info,
    recommended_data
  } = animeInfo;

  const score = info?.["MAL Score"];
  const year = info?.tvInfo?.releaseDate;
  const format = info?.Format;
  const episodes = info?.Episodes;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ---------- HERO ---------- */}
      <div className="relative h-[520px] max-md:h-[420px] overflow-hidden">
        {/* background */}
        <img
          src={poster}
          className="absolute inset-0 w-full h-full object-cover scale-110"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/40" />

        {/* content */}
        <div className="relative z-10 h-full container mx-auto px-6 flex items-end pb-12">
          <div className="flex w-full gap-10 max-md:flex-col">

            {/* LEFT */}
            <div className="flex-1">
              {/* top pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {score && (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 border border-white/20">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span>{score}%</span>
                  </div>
                )}
                {year && <span className="px-3 py-1 rounded-full bg-black/60 border border-white/20">{year}</span>}
                {format && <span className="px-3 py-1 rounded-full bg-black/60 border border-white/20">{format}</span>}
                {episodes && <span className="px-3 py-1 rounded-full bg-black/60 border border-white/20">{episodes} Episodes</span>}
              </div>

              {/* title */}
              <h1 className="text-5xl font-extrabold leading-tight max-md:text-3xl">
                {language === "EN" ? title : japanese_title}
              </h1>

              {/* genres */}
              <div className="flex flex-wrap gap-2 mt-4">
                {info?.Genres?.map((g, i) => (
                  <span
                    key={g}
                    className={`${GENRE_STYLE} ${
                      i % 3 === 0
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : i % 3 === 1
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-white/10 text-white border-white/20"
                    }`}
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* buttons */}
              <div className="flex gap-3 mt-8 max-md:flex-col">
                <Link
                  to={`/watch/${animeInfo.id}`}
                  className="inline-flex items-center gap-2 h-9 px-6 rounded-md bg-white text-black font-medium shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                >
                  <Play className="h-4 w-4 fill-black" />
                  Watch Now
                </Link>

                <button className="inline-flex items-center gap-2 h-9 px-6 rounded-md bg-black/60 border border-white/20">
                  <Plus className="h-4 w-4" />
                  Add
                </button>

                <button
                  onClick={createRoom}
                  className="inline-flex items-center gap-2 h-9 px-6 rounded-md bg-black/60 border border-white/20"
                >
                  <Users className="h-4 w-4" />
                  Watch Together
                </button>
              </div>
            </div>

            {/* POSTER */}
            <div className="w-[240px] shrink-0 relative">
              <img
                src={poster}
                className="rounded-xl shadow-[0_0_60px_rgba(255,255,255,0.35)]"
              />

              {/* share */}
              <button className="absolute -top-3 right-3 w-8 h-8 rounded-full bg-black/70 border border-white/20 flex items-center justify-center">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- DETAILS ---------- */}
      <div className="container mx-auto px-6 -mt-6">
        <div className="bg-black rounded-xl p-6">

          {/* tabs */}
          <div className="flex gap-6 border-b border-white/10 mb-6">
            {["overview", "characters", "more"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-3 capitalize ${
                  tab === t
                    ? "border-b-2 border-white text-white"
                    : "text-white/50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="space-y-6">

              {/* next episode */}
              {nextEp?.nextEpisodeSchedule && (
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-sm text-white/70">Next Episode</p>
                  <p className="text-lg font-semibold">
                    {new Date(nextEp.nextEpisodeSchedule).toLocaleString()}
                  </p>
                </div>
              )}

              {/* description */}
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/80 leading-relaxed">
                  {info?.Overview}
                </p>
              </div>

              {/* info grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  ["Format", format],
                  ["Episodes", episodes],
                  ["Duration", info?.Duration],
                  ["Score", score ? `${score}%` : null],
                  ["Status", info?.Status],
                  ["Studio", info?.Studios],
                  ["Source", info?.Source],
                  ["Season", info?.Season],
                ].map(
                  ([label, value]) =>
                    value && (
                      <div
                        key={label}
                        className="p-4 rounded-lg bg-white/5 border border-white/10"
                      >
                        <p className="text-xs text-white/50 uppercase">{label}</p>
                        <p className="text-sm font-semibold">{value}</p>
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          {/* CHARACTERS */}
          {tab === "characters" && (
            <Voiceactor animeInfo={animeInfo} />
          )}

          {/* MORE LIKE THIS */}
          {tab === "more" && recommended_data?.length > 0 && (
            <CategoryCard
              label="More Like This"
              data={recommended_data}
              showViewMore={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
