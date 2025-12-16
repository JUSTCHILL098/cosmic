import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "@/src/context/LanguageContext";
import website_name from "@/src/config/website";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import Voiceactor from "@/src/components/voiceactor/Voiceactor";
import { Play, Plus, Users, Star, Calendar } from "lucide-react";

export default function AnimeInfo() {
  const { id } = useParams();
  const { language } = useLanguage();

  const [animeInfo, setAnimeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
    return () => {
      document.title = website_name;
    };
  }, [animeInfo]);

  if (loading) return <Loader type="animeInfo" />;
  if (error || !animeInfo) return <Error />;

  const { title, japanese_title, poster, animeInfo: info } = animeInfo;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO */}
      <div className="relative pt-28 pb-16">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover opacity-30 blur-xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/40" />
        </div>

        {/* Content */}
        <div className="relative max-w-[1600px] mx-auto px-6 flex gap-12 max-lg:flex-col">
          {/* LEFT */}
          <div className="flex-1 space-y-6">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
              {info?.["MAL Score"] && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  {info["MAL Score"]}
                </div>
              )}
              {info?.Aired && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {info.Aired}
                </div>
              )}
              {info?.Status && <span>{info.Status}</span>}
              {info?.Episodes && <span>{info.Episodes} Episodes</span>}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold leading-tight max-md:text-3xl">
              {language === "EN" ? title : japanese_title}
            </h1>

            {/* Genres */}
            {info?.Genres && (
              <div className="flex flex-wrap gap-2">
                {info.Genres.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 text-xs rounded-full bg-white/10 backdrop-blur border border-white/10"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {info?.Overview && (
              <p className="max-w-2xl text-white/70 leading-relaxed">
                {info.Overview}
              </p>
            )}

            {/* Buttons */}
            <div className="flex gap-4 flex-wrap pt-4">
              <Link
                to={`/watch/${animeInfo.id}`}
                className="inline-flex items-center gap-2 h-11 px-8 rounded-md bg-white text-black font-semibold"
              >
                <Play className="h-4 w-4" />
                Watch Now
              </Link>

              <button className="inline-flex items-center gap-2 h-11 px-6 rounded-md border border-white/20 text-white">
                <Plus className="h-4 w-4" />
                Add
              </button>

              <button className="inline-flex items-center gap-2 h-11 px-6 rounded-md border border-white/20 text-white">
                <Users className="h-4 w-4" />
                Watch Together
              </button>
            </div>
          </div>

          {/* RIGHT POSTER */}
          <div className="w-[260px] shrink-0 max-lg:w-[200px] max-lg:self-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src={poster} alt={title} />
              <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs text-white/80">
                {info?.Episodes && <span>{info.Episodes} eps</span>}
                {info?.Duration && <span>{info.Duration}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="max-w-[1600px] mx-auto px-6 pb-16">
        {/* Voice Actors */}
        {animeInfo?.charactersVoiceActors?.length > 0 && (
          <div className="mt-12">
            <Voiceactor animeInfo={animeInfo} />
          </div>
        )}

        {/* Recommended */}
        {animeInfo?.recommended_data?.length > 0 && (
          <div className="mt-12">
            <CategoryCard
              label="Recommended for you"
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
