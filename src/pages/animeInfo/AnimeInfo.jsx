import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Play,
  Plus,
  Users,
  Share2,
  Star,
  Calendar,
  Film,
  Video
} from "lucide-react";

import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import Voiceactor from "@/src/components/voiceactor/Voiceactor";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import { useLanguage } from "@/src/context/LanguageContext";
import website_name from "@/src/config/website";

export default function AnimeInfo() {
  const { id } = useParams();
  const { language } = useLanguage();

  const [animeInfo, setAnimeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAnimeInfo(id);
        setAnimeInfo(data.data);
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

  const { title, japanese_title, poster, banner, animeInfo: info, recommended_data } =
    animeInfo;

  const score = info?.["MAL Score"];
  const year = info?.Season?.split(" ")?.[1];
  const format = info?.Format;
  const episodes = info?.Episodes;

  return (
    <main className="container mx-auto px-4 py-8 relative z-10 pb-20">
      {/* ================= HERO ================= */}
      <div className="relative mb-12 overflow-hidden rounded-3xl min-h-[520px]">
        {/* background */}
        <div className="absolute inset-0">
          <img
            src={banner || poster}
            className="w-full h-full object-cover object-top scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30" />
        </div>

        {/* content */}
        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-10 h-full">
          {/* LEFT */}
          <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-center">
            {/* pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {score && (
                <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full text-xs">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{score}%</span>
                </div>
              )}
              {year && (
                <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs">
                  <Calendar className="h-3 w-3" />
                  {year}
                </div>
              )}
              {format && (
                <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs">
                  <Film className="h-3 w-3" />
                  {format}
                </div>
              )}
              {episodes && (
                <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs">
                  <Video className="h-3 w-3" />
                  {episodes} Episodes
                </div>
              )}
            </div>

            {/* title */}
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              {language === "EN" ? title : japanese_title}
            </h1>

            {/* genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {info?.Genres?.map((g, i) => (
                <span
                  key={g}
                  className={`px-3 py-1 text-xs rounded-md backdrop-blur-md border ${
                    i % 2 === 0
                      ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                      : "bg-amber-400/10 text-amber-400 border-amber-400/20"
                  }`}
                >
                  {g}
                </span>
              ))}
            </div>

            {/* buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/watch/${animeInfo.id}`}
                className="inline-flex items-center gap-2 h-10 px-8 rounded-md bg-white text-black font-medium shadow-lg"
              >
                <Play className="h-4 w-4 fill-black" />
                Watch Now
              </Link>

              <button className="inline-flex items-center gap-2 h-10 px-8 rounded-md bg-black/40 border border-white/20">
                <Plus className="h-4 w-4" />
                Add
              </button>

              <Link
                to="/rooms"
                className="inline-flex items-center gap-2 h-10 px-8 rounded-md bg-black/40 border border-white/20"
              >
                <Users className="h-4 w-4 animate-pulse" />
                Watch Together
              </Link>
            </div>
          </div>

          {/* RIGHT POSTER */}
          <div className="md:col-span-4 lg:col-span-3 flex justify-center md:justify-end">
            <div className="relative w-[240px]">
              <div className="absolute inset-[-6px] bg-gradient-to-r from-primary/40 via-primary/10 to-primary/40 rounded-2xl blur-lg opacity-70" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img src={poster} className="w-full h-full object-cover" />
                <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center">
                  <Share2 className="h-4 w-4" />
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-white/70 text-xs">Episodes</p>
                      <p className="font-bold">{episodes}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">Duration</p>
                      <p className="font-bold">{info?.Duration}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DETAILS ================= */}
      <section>
        <h2 className="text-2xl font-bold mb-1">Details</h2>
        <p className="text-white/50 mb-4">
          Explore more about {title}
        </p>

        {/* tabs */}
        <div className="flex gap-4 border-b border-white/10 mb-6">
          {["overview", "characters", "more"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm ${
                tab === t
                  ? "border-b-2 border-primary text-primary"
                  : "text-white/50"
              }`}
            >
              {t === "more" ? "More Like This" : t}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

            <div className="text-white/80 leading-relaxed">
              {info?.Overview}
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
      </section>
    </main>
  );
}
