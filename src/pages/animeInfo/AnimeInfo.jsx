import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Play,
  Heart,
  Film,
  Calendar,
  Video,
  Star,
  Clock,
  Info,
  Users,
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
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAnimeInfo(id);
        setAnimeInfo(data.data);

        const nextEp = await getNextEpisodeSchedule(id);
        setNextEpisodeSchedule(nextEp);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <Loader type="animeInfo" />;
  if (!animeInfo) return <Error />;

  const info = animeInfo.animeInfo;

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* ================= HERO ================= */}
      <div className="relative">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={animeInfo.banner || animeInfo.poster}
            className="w-full h-full object-cover object-top scale-105 saturate-125"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-28 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* LEFT */}
            <div className="md:col-span-8 space-y-4">
              {/* Pills */}
              <div className="flex flex-wrap gap-2">
                <Pill icon={<Film />} color="indigo">
                  {info?.Format}
                </Pill>
                <Pill icon={<Calendar />} color="emerald">
                  {info?.Season?.split(" ")[1]}
                </Pill>
                <Pill icon={<Video />} color="amber">
                  {info?.Episodes} Episodes
                </Pill>
                <Pill icon={<Star />} color="yellow">
                  {info?.["MAL Score"]}%
                </Pill>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold">
                {animeInfo.title}
              </h1>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {info?.Genres?.map((g) => (
                  <Link
                    key={g}
                    to={`/genre/${g}`}
                    className="px-3 py-1 text-xs font-semibold rounded-md
                               bg-white/10 border border-white/20
                               hover:bg-white/20 transition"
                  >
                    {g}
                  </Link>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Link
                  to={`/watch/${animeInfo.id}`}
                  className="inline-flex items-center gap-2 h-10 px-8 rounded-md
                             bg-primary text-black font-medium shadow-lg"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Watch Now
                </Link>

                <button
                  className="h-10 px-6 rounded-md bg-black/50 border border-white/20"
                >
                  + Add
                </button>

                <Link
                  to="/rooms"
                  className="h-10 px-6 rounded-md bg-black/50 border border-white/20 inline-flex items-center gap-2"
                >
                  <Users className="h-4 w-4 animate-pulse" />
                  Watch Together
                </Link>
              </div>

              {/* Next Episode */}
              {nextEpisodeSchedule?.nextEpisodeSchedule &&
                showNextEpisodeSchedule && (
                  <div className="mt-4 p-3 rounded-lg bg-black/60 flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-gray-400">
                        Next episode estimated:
                      </span>
                      <span className="ml-2 font-medium">
                        {new Date(
                          nextEpisodeSchedule.nextEpisodeSchedule
                        ).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowNextEpisodeSchedule(false)}
                      className="text-xl text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                )}
            </div>

            {/* RIGHT / POSTER */}
            <div className="md:col-span-4 flex justify-center md:justify-end">
              <div className="relative w-56">
                {/* Glow */}
                <div className="absolute -inset-6 bg-primary/60 blur-3xl rounded-3xl opacity-80" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={animeInfo.poster}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setLiked(!liked)}
                    className="absolute top-2 right-2 w-9 h-9 rounded-full
                               bg-black/50 backdrop-blur-sm flex items-center justify-center"
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
      </div>

      {/* ================= DETAILS ================= */}
      <div className="container mx-auto px-4 pb-20">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/10 bg-black/60 rounded-t-xl">
          <Tab
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            icon={<Info />}
            label="Overview"
          />
          <Tab
            active={activeTab === "characters"}
            onClick={() => setActiveTab("characters")}
            icon={<Users />}
            label="Characters"
          />
          <Tab
            active={activeTab === "more"}
            onClick={() => setActiveTab("more")}
            icon={<Star />}
            label="More Like This"
          />
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="bg-black/85 p-6 rounded-b-xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-6">
              <Detail label="Format" value={info?.Format} />
              <Detail label="Episodes" value={info?.Episodes} />
              <Detail label="Duration" value={info?.Duration} />
              <Detail label="Score" value={`${info?.["MAL Score"]}%`} />
              <Detail label="Status" value={info?.Status} />
              <Detail label="Studio" value={info?.Studios} />
              <Detail label="Source" value={info?.Source} />
              <Detail label="Season" value={info?.Season} />
            </div>

            <p className="text-white/80 leading-relaxed">
              {info?.Overview}
            </p>
          </div>
        )}

        {activeTab === "characters" && (
          <div className="mt-8">
            <Voiceactor animeInfo={animeInfo} />
          </div>
        )}

        {activeTab === "more" && animeInfo?.recommended_data?.length > 0 && (
          <div className="mt-8">
            <CategoryCard
              label="Recommended"
              data={animeInfo.recommended_data}
              showViewMore={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Pill({ children, icon, color }) {
  const colors = {
    indigo: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30",
    emerald: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
    amber: "bg-amber-500/20 text-amber-300 border-amber-400/30",
    yellow: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${colors[color]}`}
    >
      {icon}
      {children}
    </span>
  );
}

function Tab({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition
        ${
          active
            &&
          "border-primary text-white bg-black"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <span className="text-xs uppercase text-gray-400">{label}</span>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
