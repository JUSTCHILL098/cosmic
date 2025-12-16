import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Play,
  Plus,
  Users,
  Share2,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";

import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import getNextEpisodeSchedule from "@/src/utils/getNextEpisodeSchedule.utils";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import Voiceactor from "@/src/components/voiceactor/Voiceactor";
import website_name from "@/src/config/website";
import { useLanguage } from "@/src/context/LanguageContext";

/* ---------------- HELPERS ---------------- */

function StatPill({ children }) {
  return (
    <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium">
      {children}
    </div>
  );
}

/* ---------------- PAGE ---------------- */

export default function AnimeInfo() {
  const { id } = useParams();
  const { language } = useLanguage();

  const [animeInfo, setAnimeInfo] = useState(null);
  const [nextEp, setNextEp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    async function fetchData() {
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

  /* ---------------- COUNTDOWN ---------------- */
  const countdown =
    nextEp?.airingAt &&
    Math.max(0, Math.floor((new Date(nextEp.airingAt) - Date.now()) / 1000));

  const days = countdown ? Math.floor(countdown / 86400) : null;
  const hours = countdown ? Math.floor((countdown % 86400) / 3600) : null;
  const minutes = countdown ? Math.floor((countdown % 3600) / 60) : null;
  const seconds = countdown ? countdown % 60 : null;

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* ---------------- BANNER ---------------- */}
      <div className="absolute inset-x-0 top-0 h-[520px] -z-10">
        <img
          src={poster}
          alt=""
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/85 to-black" />
      </div>

      <div className="pt-[96px] px-4 max-w-[1400px] mx-auto">
        {/* ---------------- HEADER ---------------- */}
        <div className="flex gap-8 max-lg:flex-col-reverse">
          {/* LEFT */}
          <div className="flex-1">
            {/* STATS ROW */}
            <div className="flex flex-wrap gap-2 mb-4">
              {info?.["MAL Score"] && <StatPill>{info["MAL Score"]}%</StatPill>}
              {info?.Season && <StatPill>{info.Season}</StatPill>}
              {info?.Format && <StatPill>{info.Format}</StatPill>}
              {info?.Episodes && (
                <StatPill>{info.Episodes} Episodes</StatPill>
              )}
            </div>

            {/* TITLE */}
            <h1 className="text-4xl font-bold leading-tight">
              {language === "EN" ? title : japanese_title}
            </h1>
            {japanese_title && (
              <p className="text-white/50 mt-1">{japanese_title}</p>
            )}

            {/* ACTIONS */}
            <div className="mt-6 flex gap-3 flex-wrap">
              <Link
                to={`/watch/${animeInfo.id}`}
                className="
                  h-9 px-6 rounded-md
                  inline-flex items-center gap-2
                  bg-white text-black font-semibold
                  shadow-[0_0_40px_rgba(255,255,255,0.35)]
                "
              >
                <Play className="h-4 w-4" />
                Watch
              </Link>

              <button className="h-9 px-6 rounded-md inline-flex items-center gap-2 bg-white/10 border border-white/20">
                <Users className="h-4 w-4" />
                Watch Together
              </button>

              <button className="h-9 px-4 rounded-md bg-white/10 border border-white/20">
                <Plus className="h-4 w-4" />
              </button>

              <button className="h-9 w-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {/* NEXT EPISODE */}
            {nextEp && (
              <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white/70" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold">Next Episode</h3>
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs">
                        Ep {nextEp.episode}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 mb-1">
                      {nextEp.title}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(nextEp.airingAt).toDateString()}
                      </div>
                      {countdown && (
                        <div className="flex items-center gap-1 font-mono text-white">
                          <Sparkles className="h-3 w-3" />
                          {days}d {hours}:{minutes}:{seconds}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT POSTER */}
          <div className="relative w-[260px] shrink-0 mx-auto">
            <div
              className="absolute inset-0 blur-2xl opacity-60 scale-110"
              style={{
                backgroundImage: `url(${poster})`,
                backgroundSize: "cover",
              }}
            />
            <img src={poster} className="relative rounded-xl" />
          </div>
        </div>

        {/* ---------------- TABS ---------------- */}
        <div className="mt-10">
          <div className="flex gap-6 border-b border-white/10 mb-6">
            {["overview", "characters"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-2 text-sm font-semibold ${
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
            <div className="text-white/70 leading-relaxed max-w-4xl">
              {info?.Overview}
            </div>
          )}

          {/* CHARACTERS */}
          {tab === "characters" && (
            <Voiceactor animeInfo={animeInfo} />
          )}
        </div>
      </div>
    </div>
  );
}
