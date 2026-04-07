import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faClosedCaptioning, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import website_name from "@/src/config/website";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import { useLanguage } from "@/src/context/LanguageContext";
import { useHomeInfo } from "@/src/context/HomeInfoContext";
import Voiceactor from "@/src/components/voiceactor/Voiceactor";
import { Heart } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";

const GENRE_COLORS = [
  "bg-white/[0.05] border border-white/[0.09] text-white/60 hover:bg-white/[0.09] hover:text-white",
  "bg-white/[0.05] border border-white/[0.09] text-white/60 hover:bg-white/[0.09] hover:text-white",
  "bg-white/[0.05] border border-white/[0.09] text-white/60 hover:bg-white/[0.09] hover:text-white",
  "bg-white/[0.05] border border-white/[0.09] text-white/60 hover:bg-white/[0.09] hover:text-white",
  "bg-white/[0.05] border border-white/[0.09] text-white/60 hover:bg-white/[0.09] hover:text-white",
  "bg-white/[0.05] border border-white/[0.09] text-white/60 hover:bg-white/[0.09] hover:text-white",
  "bg-white/[0.05] border border-white/[0.09] text-white/60 hover:bg-white/[0.09] hover:text-white",
  "bg-white/[0.05] border border-white/[0.09] text-white/60 hover:bg-white/[0.09] hover:text-white",
  "bg-white/[0.05] border border-white/[0.09] text-white/60 hover:bg-white/[0.09] hover:text-white",
  "bg-white/[0.05] border border-white/[0.09] text-white/60 hover:bg-white/[0.09] hover:text-white",
];

function AnimeInfo({ random = false }) {
  const { language } = useLanguage();
  const { id: paramId } = useParams();
  const id = random ? null : paramId;
  const { id: currentId } = useParams();
  const navigate = useNavigate();
  const { homeInfo } = useHomeInfo();

  const [isFull,    setIsFull]    = useState(false);
  const [animeInfo, setAnimeInfo] = useState(null);
  const [seasons,   setSeasons]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [inPlaylist,  setInPlaylist]  = useState(false);
  const [plLoading,   setPlLoading]   = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (id === "404-not-found-page") return;
    (async () => {
      setLoading(true);
      try {
        const data = await getAnimeInfo(id, random);
        setSeasons(data?.seasons);
        setAnimeInfo(data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, random]);

  // Check if already in playlist
  useEffect(() => {
    if (!user || !id) return;
    supabase.from("playlist").select("id").eq("user_id", user.id).eq("anime_id", id).single()
      .then(({ data }) => setInPlaylist(!!data));
  }, [user, id]);

  const togglePlaylist = async () => {
    if (!user) { navigate("/login"); return; }
    setPlLoading(true);
    try {
      if (inPlaylist) {
        await supabase.from("playlist").delete().eq("user_id", user.id).eq("anime_id", id);
        setInPlaylist(false);
      } else {
        await supabase.from("playlist").insert({
          user_id: user.id,
          anime_id: id,
          anime_title: animeInfo?.title || "",
          poster: animeInfo?.poster || "",
          added_at: new Date().toISOString(),
        });
        setInPlaylist(true);
      }
    } catch (e) { console.error(e); }
    finally { setPlLoading(false); }
  };

  useEffect(() => {
    if (animeInfo) {
      document.title = `Watch ${animeInfo.title} English Sub/Dub online Free on ${website_name}`;
    }
    return () => { document.title = `${website_name} | Free anime streaming platform`; };
  }, [animeInfo]);

  if (loading) return <Loader type="animeInfo" />;
  if (error)   return <Error />;
  if (!animeInfo) { navigate("/404-not-found-page"); return null; }

  const { title, japanese_title, poster, animeInfo: info } = animeInfo;
  const tvInfo = info?.tvInfo || {};
  const overview = info?.Overview || "";

  const tags = [
    tvInfo.rating  && { text: tvInfo.rating },
    tvInfo.quality && { text: tvInfo.quality },
    tvInfo.sub     && { icon: faClosedCaptioning, text: `SUB ${tvInfo.sub}` },
    tvInfo.dub     && { icon: faMicrophone,       text: `DUB ${tvInfo.dub}` },
  ].filter(Boolean);

  const metaItems = [
    { label: "Japanese",  value: info?.Japanese,       link: false },
    { label: "Aired",     value: info?.Aired,          link: false },
    { label: "Premiered", value: info?.Premiered,      link: false },
    { label: "Duration",  value: info?.Duration,       link: false },
    { label: "Status",    value: info?.Status,         link: false },
    { label: "MAL Score", value: info?.["MAL Score"],  link: false },
    { label: "Studios",   value: info?.Studios,        link: true  },
    { label: "Producers", value: info?.Producers,      link: true  },
  ];

  const canWatch = animeInfo?.animeInfo?.Status?.toLowerCase() !== "not-yet-aired";

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── BANNER ── */}
      <div className="relative w-full h-[340px] md:h-[420px] overflow-hidden mt-[64px] max-md:mt-[50px]">
        {/* blurred banner */}
        <img src={poster} alt="" className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
      </div>

      {/* ── MAIN CONTENT (overlaps banner) ── */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 -mt-[260px] md:-mt-[320px]">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">

          {/* Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="relative w-[160px] md:w-[220px] aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
              <img src={poster} alt={title} className="w-full h-full object-cover" />
              {animeInfo.adultContent && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 rounded text-[10px] font-bold">18+</div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-2 md:pt-[180px]">
            {/* Title */}
            <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight mb-1">
              {language === "EN" ? title : japanese_title}
            </h1>
            {language === "EN" && japanese_title && (
              <p className="text-white/40 text-sm mb-4 font-mono">{japanese_title}</p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {tags.map(({ icon, text }, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.07] border border-white/10 text-xs font-mono text-white/80">
                  {icon && <FontAwesomeIcon icon={icon} className="text-[10px]" />}
                  {text}
                </span>
              ))}
            </div>

            {/* Watch button + playlist */}
            <div className="flex flex-wrap gap-3 mb-6">
              {canWatch ? (
                <Link to={`/watch/${animeInfo.id}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-gray-100 rounded-md text-black font-semibold text-sm transition-all font-mono shadow-none">
                  <FontAwesomeIcon icon={faPlay} className="text-xs" />
                  Watch Now
                </Link>
              ) : (
                <div className="inline-flex items-center px-6 py-2.5 bg-zinc-800 rounded-md text-zinc-400 text-sm font-mono">
                  Not Released Yet
                </div>
              )}
              {/* Heart / playlist toggle */}
              <button
                onClick={togglePlaylist}
                disabled={plLoading}
                title={inPlaylist ? "Remove from playlist" : "Add to playlist"}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-mono transition-all"
                style={{
                  background: inPlaylist ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${inPlaylist ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"}`,
                  color: inPlaylist ? "#f87171" : "rgba(255,255,255,0.6)",
                }}
              >
                <Heart className={`w-4 h-4 transition-all ${inPlaylist ? "fill-red-400 text-red-400" : ""}`} />
                {inPlaylist ? "Saved" : "Save"}
              </button>
            </div>

            {/* Overview */}
            {overview && (
              <div className="mb-6">
                <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
                  {isFull || overview.length <= 300 ? overview : `${overview.slice(0, 300)}…`}
                  {overview.length > 300 && (
                    <button onClick={() => setIsFull(v => !v)}
                      className="ml-2 text-indigo-400 hover:text-indigo-300 text-xs font-mono transition-colors">
                      {isFull ? "Show less" : "Read more"}
                    </button>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── META + GENRES ── */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">

          {/* Left: meta grid */}
          <div className="rounded-xl p-5" style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
              {metaItems.map(({ label, value, link }) =>
                value ? (
                  <div key={label}>
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-0.5">{label}</p>
                    <div className="text-sm text-white/80">
                      {Array.isArray(value) ? (
                        <div className="flex flex-wrap gap-1">
                          {value.map((v, i) => link ? (
                            <Link key={i} to={`/producer/${v.replace(/[&'"^%$#@!()+=<>:;,.?/\\|{}[\]`~*_]/g,"").split(" ").join("-").replace(/-+/g,"-")}`}
                              className="text-indigo-400 hover:text-indigo-300 transition-colors text-xs font-mono">
                              {v}{i < value.length - 1 && ","}
                            </Link>
                          ) : (
                            <span key={i} className="text-xs font-mono">{v}{i < value.length - 1 && ","}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs font-mono">{value}</span>
                      )}
                    </div>
                  </div>
                ) : null
              )}
            </div>

            {/* Genres */}
            {info?.Genres?.length > 0 && (
              <div className="mt-5 pt-4 border-t border-white/[0.06]">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-3">Genres</p>
                <div className="flex flex-wrap gap-2">
                  {info.Genres.map((g, i) => (
                    <Link key={i} to={`/genre/${g.split(" ").join("-")}`}
                      className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${GENRE_COLORS[i % GENRE_COLORS.length]}`}>
                      {g}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: synonyms / extra */}
          {(info?.Synonyms || info?.["MAL Score"]) && (
            <div className="rounded-xl p-5 h-fit" style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">Also Known As</h3>
              {info?.Synonyms && (
                <p className="text-sm text-white/60 font-mono leading-relaxed">{info.Synonyms}</p>
              )}
              {info?.["MAL Score"] && (
                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-1">MAL Score</p>
                  <p className="text-2xl font-black text-white font-mono">{info["MAL Score"]}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── SEASONS ── */}
        {seasons?.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">More Seasons</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {seasons.map((season, i) => (
                <Link to={`/${season.id}`} key={i}
                  className="relative aspect-[3/1] rounded-lg overflow-hidden group transition-all"
                  style={{
                    background: "#000",
                    border: currentId === String(season.id)
                      ? "1px solid rgba(255,255,255,0.3)"
                      : "1px solid rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={e => { if (currentId !== String(season.id)) e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
                  onMouseLeave={e => { if (currentId !== String(season.id)) e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                >
                  <img src={season.season_poster} alt={season.season}
                    className="w-full h-full object-cover scale-150 opacity-20 group-hover:opacity-35 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xs font-bold text-white text-center px-2 font-mono">{season.season}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── VOICE ACTORS ── */}
        {animeInfo?.charactersVoiceActors?.length > 0 && (
          <div className="mt-10">
            <Voiceactor animeInfo={animeInfo} />
          </div>
        )}

        {/* ── RECOMMENDATIONS ── */}
        {animeInfo?.recommended_data?.length > 0 && (
          <div className="mt-10 pb-24">
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

export default AnimeInfo;
