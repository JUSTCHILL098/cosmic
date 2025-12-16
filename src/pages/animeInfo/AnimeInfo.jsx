import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Play,
  Plus,
  Users,
  Share2,
  Film,
  Clock,
  Star,
  Layers,
  Calendar,
  Tv,
  BookOpen,
  Info,
  UsersRound
} from "lucide-react";

import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import getNextEpisodeSchedule from "@/src/utils/getNextEpisodeSchedule.utils";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import Voiceactor from "@/src/components/voiceactor/Voiceactor";
import website_name from "@/src/config/website";
import { useLanguage } from "@/src/context/LanguageContext";

/* ---------------- SMALL UI ---------------- */

const StatPill = ({ children }) => (
  <div className="px-3 py-1 rounded-full bg-black/50 border border-white/20 text-xs font-semibold">
    {children}
  </div>
);

const MetaItem = ({ icon: Icon, label, value }) =>
  value ? (
    <div className="flex items-center gap-2 text-sm text-white/80">
      <Icon className="h-4 w-4 text-white/60" />
      <span className="text-white/60">{label}:</span>
      <span>{value}</span>
    </div>
  ) : null;

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

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* ---------------- BANNER BACKGROUND ---------------- */}
      <div className="absolute inset-x-0 top-0 h-[520px] -z-10">
        <img
          src={poster}
          alt=""
          className="w-full h-full object-cover object-top scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/90 to-black" />
      </div>

      <div className="pt-[96px] px-4 max-w-[1400px] mx-auto">
        {/* ---------------- HEADER ---------------- */}
        <div className="flex gap-10 max-lg:flex-col-reverse">
          {/* LEFT */}
          <div className="flex-1">
            {/* STATS */}
            <div className="flex flex-wrap gap-2 mb-4">
              {info?.["MAL Score"] && <StatPill>{info["MAL Score"]}%</StatPill>}
              {info?.Season && <StatPill>{info.Season}</StatPill>}
              {info?.Format && <StatPill>{info.Format}</StatPill>}
              {info?.Episodes && <StatPill>{info.Episodes} Episodes</StatPill>}
            </div>

            {/* TITLE */}
            <h1 className="text-4xl font-bold leading-tight">
              {language === "EN" ? title : japanese_title}
            </h1>
            {japanese_title && (
              <p className="text-white/50 mt-1">{japanese_title}</p>
            )}

            {/* BUTTONS */}
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
                <Play className="h-4 w-4 fill-black" />
                Watch Now
              </Link>

              <button className="h-9 px-5 rounded-md inline-flex items-center gap-2 bg-black border border-white/20">
                <Users className="h-4 w-4" />
                Watch Together
              </button>

              <button className="h-9 px-4 rounded-md bg-black border border-white/20">
                <Plus className="h-4 w-4" />
              </button>
            </div>
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

        {/* SHARE BUTTON */}
        <div className="mt-6 flex justify-end">
          <button className="h-8 w-8 rounded-full bg-black border border-white/20 flex items-center justify-center">
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* ---------------- TABS ---------------- */}
        <div className="mt-4">
          <div className="flex gap-6 border-b border-white/10 mb-6">
            <button
              onClick={() => setTab("overview")}
              className={`pb-2 flex items-center gap-2 text-sm font-semibold ${
                tab === "overview"
                  ? "text-white border-b-2 border-white"
                  : "text-white/50"
              }`}
            >
              <Info className="h-4 w-4" /> Overview
            </button>
            <button
              onClick={() => setTab("characters")}
              className={`pb-2 flex items-center gap-2 text-sm font-semibold ${
                tab === "characters"
                  ? "text-white border-b-2 border-white"
                  : "text-white/50"
              }`}
            >
              <UsersRound className="h-4 w-4" /> Characters
            </button>
          </div>

          {/* ---------------- OVERVIEW ---------------- */}
          {tab === "overview" && (
            <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-6">
              {/* META GRID */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <MetaItem icon={Film} label="Format" value={info?.Format} />
                <MetaItem icon={Layers} label="Episodes" value={info?.Episodes} />
                <MetaItem icon={Clock} label="Duration" value={info?.Duration} />
                <MetaItem icon={Star} label="Score" value={`${info?.["MAL Score"]}%`} />
                <MetaItem icon={Tv} label="Status" value={info?.Status} />
                <MetaItem icon={Calendar} label="Season" value={info?.Season} />
                <MetaItem icon={Users} label="Studio" value={info?.Studios} />
                <MetaItem icon={BookOpen} label="Source" value={info?.Source} />
              </div>

              {/* GENRES */}
              {info?.Genres && (
                <div className="flex flex-wrap gap-2">
                  {info.Genres.map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {/* DESCRIPTION */}
              <p className="text-white/70 leading-relaxed">
                {info?.Overview}
              </p>
            </div>
          )}

          {/* ---------------- CHARACTERS ---------------- */}
          {tab === "characters" && <Voiceactor animeInfo={animeInfo} />}
        </div>
      </div>
    </div>
  );
}
