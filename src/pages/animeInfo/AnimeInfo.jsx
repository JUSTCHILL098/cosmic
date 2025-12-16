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
} from "lucide-react";

import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import getNextEpisodeSchedule from "@/src/utils/getNextEpisodeSchedule.utils";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import Voiceactor from "@/src/components/voiceactor/Voiceactor";
import CategoryCard from "@/src/components/categorycard/CategoryCard";

export default function AnimeInfo() {
  const { id } = useParams();

  const [animeInfo, setAnimeInfo] = useState(null);
  const [nextEpisodeSchedule, setNextEpisodeSchedule] = useState(null);
  const [showNextEpisodeSchedule, setShowNextEpisodeSchedule] = useState(true);
  const [tab, setTab] = useState("overview");
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  if (loading) return <Loader type="animeInfo" />;
  if (error || !animeInfo) return <Error />;

  const info = animeInfo.animeInfo;

  return (
    <main className="container mx-auto px-4 py-6 pb-24">
      {/* ================= HERO ================= */}
      <div className="relative rounded-3xl overflow-hidden mb-10">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={animeInfo.banner || animeInfo.poster}
            className="w-full h-full object-cover object-top scale-105"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 p-4 sm:p-6 md:p-10">
          {/* LEFT */}
          <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-center">
            {/* Pills */}
            <div className="flex flex-wrap gap-2 mb-3">
              {info?.["MAL Score"] && (
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {info["MAL Score"]}%
                </div>
              )}
              {info?.Season && (
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs">
                  <Calendar className="h-3 w-3" />
                  {info.Season.split(" ")[1]}
                </div>
              )}
              {info?.Format && (
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs">
                  <Film className="h-3 w-3" />
                  {info.Format}
                </div>
              )}
              {info?.Episodes && (
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs">
                  <Video className="h-3 w-3" />
                  {info.Episodes} EPS
                </div>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2">
              {animeInfo.title}
            </h1>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {info?.Genres?.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 text-xs rounded-md bg-black/30 backdrop-blur-md border border-white/10"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mb-3">
              <Link
                to={`/watch/${animeInfo.id}`}
                className="inline-flex items-center gap-2 h-10 px-6 rounded-md bg-white text-black font-medium"
              >
                <Play className="h-4 w-4 fill-black" />
                Watch Now
              </Link>

              <button className="inline-flex items-center gap-2 h-10 px-6 rounded-md bg-black/40 border border-white/20">
                <Plus className="h-4 w-4" />
                Add
              </button>

              <Link
                to="/rooms"
                className="inline-flex items-center gap-2 h-10 px-6 rounded-md bg-black/40 border border-white/20"
              >
                <Users className="h-4 w-4 animate-pulse" />
                Watch Together
              </Link>
            </div>

            {/* Next Episode */}
            {nextEpisodeSchedule?.nextEpisodeSchedule &&
              showNextEpisodeSchedule && (
                <div className="max-w-xl mt-2">
                  <div className="p-3 rounded-lg bg-[#272727] flex justify-between items-center">
                    <span className="text-sm text-gray-300">
                      🚀 Next episode at{" "}
                      {new Date(
                        new Date(
                          nextEpisodeSchedule.nextEpisodeSchedule
                        ).getTime() -
                          new Date().getTimezoneOffset() * 60000
                      ).toLocaleString()}
                    </span>
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

          {/* POSTER */}
          <div className="md:col-span-4 lg:col-span-3 flex justify-center md:justify-end">
            <div className="relative w-[220px] sm:w-[260px]">
              {/* GLOW */}
              <div className="absolute -inset-3 bg-primary/30 blur-2xl rounded-3xl opacity-80" />
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={animeInfo.poster}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setLiked(!liked)}
                  className="absolute top-2 right-2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center"
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
        {/* TABLIST (UNCHANGED STRUCTURE) */}
        <div
          role="tablist"
          className="inline-flex items-center w-full overflow-x-auto bg-muted/30 backdrop-blur-sm border-b border-border rounded-t-2xl gap-1"
        >
          {["overview", "characters", "more"].map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm flex-shrink-0 ${
                tab === t
                  ? "border-b-2 border-primary text-primary bg-background"
                  : "text-muted-foreground"
              }`}
            >
              {t === "overview"
                ? "Overview"
                : t === "characters"
                ? "Characters"
                : "More Like This"}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="bg-muted/30 backdrop-blur-sm rounded-b-xl p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              {[
                ["Format", info?.Format],
                ["Episodes", info?.Episodes],
                ["Duration", info?.Duration],
                ["Score", info?.["MAL Score"] && `${info["MAL Score"]}%`],
                ["Status", info?.Status],
                ["Studio", info?.Studios],
                ["Source", info?.Source],
                ["Season", info?.Season],
              ].map(
                ([label, value]) =>
                  value && (
                    <div key={label}>
                      <p className="text-xs text-muted-foreground uppercase">
                        {label}
                      </p>
                      <p className="font-medium">{value}</p>
                    </div>
                  )
              )}
            </div>

            <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
              {info?.Overview}
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
