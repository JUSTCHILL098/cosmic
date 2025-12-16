/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Play,
  Users,
  Share2,
  Star,
  Calendar,
  Tv,
  Clock,
  Layers
} from "lucide-react";

import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import getNextEpisodeSchedule from "@/src/utils/getNextEpisodeSchedule.utils";
import website_name from "@/src/config/website";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import Voiceactor from "@/src/components/voiceactor/Voiceactor";
import { useLanguage } from "@/src/context/LanguageContext";
import { useMultiplayer } from "@/src/context/MultiplayerContext";

/* -------------------------------- */

const GENRE_COLORS = [
  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "bg-white/10 text-white border-white/20",
];

/* -------------------------------- */

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
    async function load() {
      try {
        const res = await getAnimeInfo(id);
        setAnimeInfo(res.data);

        const schedule = await getNextEpisodeSchedule(id);
        setNextEp(schedule);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <Loader type="animeInfo" />;
  if (error || !animeInfo) return <Error />;

  const info = animeInfo.animeInfo;
  const title = language === "EN" ? animeInfo.title : animeInfo.japanese_title;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ===== BANNER ===== */}
      <div className="relative w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${animeInfo.poster})` }}
        />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 pt-28 pb-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* LEFT */}
          <div>
            {/* META */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80 mb-3">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                {info?.["MAL Score"] ?? "—"}%
              </span>
              <span>{info?.Season}</span>
              <span>{info?.Format}</span>
              <span>{info?.Episodes} Episodes</span>
            </div>

            {/* TITLE */}
            <h1 className="text-4xl font-bold leading-tight">{title}</h1>

            {/* GENRES */}
            <div className="flex flex-wrap gap-2 mt-4">
              {info?.Genres?.map((g, i) => (
                <Link
                  key={g}
                  to={`/genre/${g}`}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    GENRE_COLORS[i % GENRE_COLORS.length]
                  }`}
                >
                  {g}
                </Link>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                to={`/watch/${animeInfo.id}`}
                className="h-9 px-5 rounded-md bg-white text-black font-medium flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-black" />
                Watch Now
              </Link>

              <button
                onClick={createRoom}
                className="h-9 px-5 rounded-md bg-black/60 border border-white/20 flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Watch Together
              </button>

              <button className="h-9 w-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT POSTER */}
          <div className="relative">
            <img
              src={animeInfo.poster}
              alt={title}
              className="rounded-xl shadow-[0_0_60px_rgba(255,255,255,0.15)]"
            />
          </div>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="max-w-[1600px] mx-auto px-6 pb-20">
        {/* NEXT EP */}
        {nextEp?.nextEpisodeSchedule && (
          <div className="mt-6 p-4 rounded-xl bg-black border border-white/10 flex items-center gap-4">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">Next Episode</p>
              <p className="text-xs text-white/70">
                {new Date(nextEp.nextEpisodeSchedule).toDateString()}
              </p>
            </div>
          </div>
        )}

        {/* TABS */}
        <div className="flex gap-6 mt-10 border-b border-white/10">
          {["overview", "characters"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 text-sm font-semibold ${
                tab === t
                  ? "text-white border-b-2 border-white"
                  : "text-white/50"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
            <div className="bg-black border border-white/10 rounded-xl p-6">
              <p className="text-white/80 leading-relaxed">
                {info?.Overview}
              </p>
            </div>

            <div className="bg-black border border-white/10 rounded-xl p-6 space-y-3 text-sm">
              <Info icon={<Tv />} label="Format" value={info?.Format} />
              <Info icon={<Layers />} label="Episodes" value={info?.Episodes} />
              <Info icon={<Clock />} label="Duration" value={info?.Duration} />
              <Info icon={<Star />} label="Score" value={`${info?.["MAL Score"]}%`} />
              <Info icon={<Calendar />} label="Season" value={info?.Season} />
              <Info label="Studio" value={info?.Studios} />
              <Info label="Source" value={info?.Source} />
              <Info label="Status" value={info?.Status} />
            </div>
          </div>
        )}

        {/* CHARACTERS */}
        {tab === "characters" && (
          <div className="mt-6">
            <Voiceactor animeInfo={animeInfo} />
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------- */

function Info({ label, value, icon }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 text-white/80">
      {icon && <span className="text-primary">{icon}</span>}
      <span className="text-white/50">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
