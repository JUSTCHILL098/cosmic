import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Play,
  Plus,
  Users,
  Heart,
  Star,
  Calendar,
  Film,
  Video,
  Info,
  Users as UsersIcon,
  Sparkles
} from "lucide-react";

import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import getNextEpisodeSchedule from "@/src/utils/getNextEpisodeSchedule.utils";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import Voiceactor from "@/src/components/voiceactor/Voiceactor";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import website_name from "@/src/config/website";
import { useLanguage } from "@/src/context/LanguageContext";

export default function AnimeInfo() {
  const { id } = useParams();
  const { language } = useLanguage();

  const [animeInfo, setAnimeInfo] = useState(null);
  const [nextEpisodeSchedule, setNextEpisodeSchedule] = useState(null);
  const [showNextEpisodeSchedule, setShowNextEpisodeSchedule] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [tab, setTab] = useState("overview");
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAnimeInfo(id);
        setAnimeInfo(data.data);

        const schedule = await getNextEpisodeSchedule(id);
        setNextEpisodeSchedule(schedule);
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
      document.title = `Watch ${animeInfo.title} on ${website_name}`;
    }
    return () => (document.title = website_name);
  }, [animeInfo]);

  if (loading) return <Loader type="animeInfo" />;
  if (error || !animeInfo) return <Error />;

  const { title, japanese_title, poster, banner, animeInfo: info } = animeInfo;

  const score = info?.["MAL Score"];
  const format = info?.Format;
  const episodes = info?.Episodes;
  const year = info?.Season?.split(" ")?.[1];

  return (
    <main className="container mx-auto px-4 py-8 pb-24">
      {/* ================= HERO ================= */}
      <div className="relative rounded-3xl overflow-hidden mb-12 min-h-[560px]">
        {/* background */}
        <div className="absolute inset-0">
          <img
            src={banner || poster}
            className="w-full h-full object-cover object-top scale-110"
          />
          <div className="absolute inset-0 bg-black/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-10">
          {/* LEFT */}
          <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-center">
            {/* Pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {score && (
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{score}%</span>
                </div>
              )}
              {year && (
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs">
                  <Calendar className="h-3 w-3" />
                  {year}
                </div>
              )}
              {format && (
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs">
                  <Film className="h-3 w-3" />
                  {format}
                </div>
              )}
              {episodes && (
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs">
                  <Video className="h-3 w-3" />
                  {episodes} Episodes
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
              {language === "EN" ? title : japanese_title}
            </h1>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {info?.Genres?.map((g, i) => (
                <span
                  key={g}
                  className="px-3 py-1 text-xs rounded-md bg-white/10 backdrop-blur-md border border-white/10"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mb-4">
              <Link
                to={`/watch/${animeInfo.id}`}
                className="inline-flex items-center gap-2 h-10 px-8 rounded-md bg-white text-black font-medium"
              >
                <Play className="h-4 w-4 fill-black" />
                Watch Now
              </Link>

              <button className="inline-flex items-center gap-2 h-10 px-8 rounded-md bg-black/50 border border-white/20">
                <Plus className="h-4 w-4" />
                Add
              </button>

              <Link
                to="/rooms"
                className="inline-flex items-center gap-2 h-10 px-8 rounded-md bg-black/50 border border-white/20"
              >
                <Users className="h-4 w-4 animate-pulse" />
                Watch Together
              </Link>
            </div>

            {/* Next Episode */}
            {nextEpisodeSchedule?.nextEpisodeSchedule &&
              showNextEpisodeSchedule && (
                <div className="mt-2 max-w-xl">
                  <div className="p-3 rounded-lg bg-[#272727] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <div className="text-sm">
                        <span className="text-gray-400">
                          Next episode estimated at
                        </span>
                        <span className="ml-2 text-white font-medium">
                          {new Date(
                            new Date(
                              nextEpisodeSchedule.nextEpisodeSchedule
                            ).getTime() -
                              new Date().getTimezoneOffset() * 60000
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowNextEpisodeSchedule(false)}
                      className="text-xl text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
          </div>

          {/* RIGHT POSTER */}
          <div className="md:col-span-4 lg:col-span-3 flex justify-center md:justify-end">
            <div className="relative w-[280px]">
              <div className="absolute inset-[-8px] bg-red-500/20 blur-2xl rounded-3xl" />
              <div className="relative rounded-2xl overflow-hidden">
                <img src={poster} className="w-full h-full object-cover" />
                <button
                  onClick={() => setLiked(!liked)}
                  className="absolute top-2 right-2 w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      liked ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DETAILS ================= */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Details</h2>
            <p className="text-white/50 text-sm">
              Explore more about {title}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10 mb-6 overflow-x-auto">
          {[
            ["overview", "Overview", Info],
            ["characters", "Characters", UsersIcon],
            ["more", "More Like This", Star],
          ].map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm ${
                tab === key
                  ? "border-b-2 border-primary text-primary"
                  : "text-white/50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                ["Format", format],
                ["Episodes", episodes],
                ["Duration", info?.Duration],
                ["Score", score && `${score}%`],
                ["Status", info?.Status],
                ["Studio", info?.Studios],
                ["Source", info?.Source],
                ["Season", info?.Season],
              ].map(
                ([label, value]) =>
                  value && (
                    <div key={label}>
                      <p className="text-xs text-white/50 uppercase">{label}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  )
              )}
            </div>

            <p className="text-white/80 leading-relaxed">
              {expanded ? info?.Overview : info?.Overview?.slice(0, 280) + "..."}
              {info?.Overview?.length > 280 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="ml-2 underline text-primary"
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </p>
          </div>
        )}

        {tab === "characters" && <Voiceactor animeInfo={animeInfo} />}

        {tab === "more" && animeInfo?.recommended_data?.length > 0 && (
          <CategoryCard
            label="More Like This"
            data={animeInfo.recommended_data}
            showViewMore={false}
          />
        )}
      </section>
    </main>
  );
}
