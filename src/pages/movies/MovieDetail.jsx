import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getMovieDetail, getMovieSources } from "@/src/utils/movies.utils";
import Player from "@/src/components/player/Player";
import BouncingLoader from "@/src/components/ui/bouncingloader/Bouncingloader";
import { Skeleton } from "@/src/components/ui/Skeleton/Skeleton";
import { motion } from "framer-motion";
import { Star, Clock, Calendar, Play, Film } from "lucide-react";
import { saveProgress } from "@/src/utils/continueWatching.utils";

const CARD = { background: "#111", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12 };
const SERVERS = ["vidcloud", "akcloud", "upcloud"];

const GlassPill = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono"
    style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.7)" }}>
    {children}
  </span>
);

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [isFull,     setIsFull]     = useState(false);
  const [streamUrl,  setStreamUrl]  = useState(null);
  const [subtitles,  setSubtitles]  = useState([]);
  const [streamErr,  setStreamErr]  = useState(null);
  const [streamLoad, setStreamLoad] = useState(false);
  const [server,     setServer]     = useState("vidcloud");
  const [autoLoaded, setAutoLoaded] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMovieDetail(decodeURIComponent(id))
      .then(d => { setData(d); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Auto-load stream once data is ready
  useEffect(() => {
    if (data && !autoLoaded) {
      setAutoLoaded(true);
      loadStream("vidcloud", data);
    }
  }, [data]);

  const loadStream = async (srv = server, movieData = data) => {
    if (!movieData) return;
    setStreamLoad(true);
    setStreamErr(null);
    setStreamUrl(null);
    try {
      const epId = movieData.episodeId || movieData.id;
      const src  = await getMovieSources(epId, srv);
      const m3u8 = src.sources?.find(s => s.isM3u8 || s.type === "hls")?.url || src.sources?.[0]?.url;
      if (!m3u8) throw new Error("No stream found");
      setStreamUrl(m3u8);
      setSubtitles(src.subtitles || []);
    } catch (e) {
      setStreamErr(e.message);
    } finally {
      setStreamLoad(false);
    }
  };

  const switchServer = (srv) => {
    setServer(srv);
    loadStream(srv);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:"#000" }}>
      <BouncingLoader />
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background:"#000" }}>
      <p className="text-white/30 font-mono text-sm">Failed to load movie</p>
      <button onClick={() => navigate("/movies")} className="text-white/50 hover:text-white font-mono text-xs underline">← Back</button>
    </div>
  );

  const overview = data.overview || "";

  return (
    <div className="w-full min-h-screen" style={{ background: "#000" }}>
      <div className="w-full max-w-[1920px] mx-auto pt-16 pb-10 max-[1200px]:pt-12 px-4">
        <div className="grid grid-cols-[minmax(0,75%),minmax(0,25%)] gap-4 w-full max-[1200px]:flex max-[1200px]:flex-col">

          {/* LEFT */}
          <div className="flex flex-col w-full gap-3">

            {/* 1. Player */}
            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }}
              className="rounded-xl overflow-hidden" style={{ background:"#000", border:"1px solid rgba(255,255,255,0.09)" }}>
              <div ref={videoRef} className="w-full relative aspect-video bg-black">
                {streamLoad ? (
                  <div className="absolute inset-0 flex justify-center items-center bg-black">
                    <BouncingLoader />
                  </div>
                ) : streamUrl ? (
                  <Player
                    key={streamUrl + "-" + server}
                    streamUrl={streamUrl}
                    subtitles={subtitles}
                    onMediaError={() => setStreamErr("Playback error — try another server")}
                    onTimeUpdate={(currentTime, duration) => {
                      if (!data) return;
                      saveProgress({
                        id: id,
                        episodeId: data.episodeId || id,
                        episodeNum: 1,
                        title: data.title,
                        japanese_title: data.title,
                        poster: data.poster,
                        adultContent: false,
                        currentTime,
                        duration,
                      });
                    }}
                  />
                ) : streamErr ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black">
                    <Film className="w-10 h-10 text-white/10" />
                    <p className="text-white/40 font-mono text-sm">{streamErr}</p>
                    <button onClick={() => loadStream(server)} className="text-white/60 hover:text-white font-mono text-xs underline">Retry</button>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black">
                    <Film className="w-10 h-10 text-white/10" />
                    <p className="text-white/30 font-mono text-xs">Loading stream...</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* 2. Server switcher */}
            <div className="rounded-xl overflow-hidden" style={CARD}>
              <div className="px-3 py-2.5 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider mr-1">Server</span>
                {SERVERS.map(s => (
                  <button key={s} onClick={() => switchServer(s)}
                    className="px-3 py-1.5 rounded-md text-[11px] font-mono transition-all"
                    style={{
                      background: server === s ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                      border: server === s ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.08)",
                      color: server === s ? "#fff" : "rgba(255,255,255,0.4)",
                    }}>
                    {s}
                  </button>
                ))}
                {streamErr && (
                  <span className="text-red-400 font-mono text-[10px] ml-2">{streamErr}</span>
                )}
              </div>
            </div>

            {/* 3. Movie info card */}
            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3, delay:0.1 }}
              className="rounded-xl overflow-hidden" style={CARD}>
              {data.poster && (
                <div className="relative h-28 overflow-hidden">
                  <img src={data.poster} alt="" className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-20" />
                  <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom, transparent 0%, #111 100%)" }} />
                </div>
              )}
              <div className="px-5 pb-5" style={{ marginTop: data.poster ? "-40px" : 0 }}>
                <div className="flex gap-5">
                  <div className="flex-shrink-0">
                    {data.poster
                      ? <img src={data.poster} alt={data.title}
                          className="w-[110px] h-[160px] object-cover rounded-xl shadow-2xl"
                          style={{ border:"1px solid rgba(255,255,255,0.1)" }}
                          onError={e => { e.target.src = "https://placehold.co/110x160/111/333?text=No+Poster"; }} />
                      : <Skeleton className="w-[110px] h-[160px] rounded-xl" />}
                  </div>
                  <div className="flex flex-col gap-3 flex-1 min-w-0 pt-2">
                    <h1 className="text-xl font-black text-white leading-tight font-mono">{data.title}</h1>
                    <div className="flex flex-wrap gap-2">
                      {data.rating && data.rating !== "N/A" && (
                        <GlassPill><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{data.rating}</GlassPill>
                      )}
                      {data.duration && <GlassPill><Clock className="w-3 h-3" />{data.duration}</GlassPill>}
                      {data.year && <GlassPill><Calendar className="w-3 h-3" />{data.year}</GlassPill>}
                      {data.quality && <GlassPill>{data.quality}</GlassPill>}
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-1">
                      {[
                        { l:"Type",       v: data.type },
                        { l:"Country",    v: data.country },
                        { l:"Production", v: data.production },
                      ].filter(m => m.v).map(m => (
                        <div key={m.l} className="flex items-center gap-1.5">
                          <span className="text-[10px] text-white/25 font-mono uppercase tracking-wider">{m.l}</span>
                          <span className="text-[10px] text-white/55 font-mono">{m.v}</span>
                        </div>
                      ))}
                    </div>
                    {overview && (
                      <p className="text-sm text-white/40 font-mono leading-relaxed">
                        {isFull ? overview : overview.slice(0, 240) + (overview.length > 240 ? "..." : "")}
                        {overview.length > 240 && (
                          <button className="ml-1.5 text-white/60 hover:text-white transition-colors text-xs" onClick={() => setIsFull(!isFull)}>
                            {isFull ? "less" : "more"}
                          </button>
                        )}
                      </p>
                    )}
                  </div>
                </div>
                {/* Genres */}
                {data.genres?.length > 0 && (
                  <div className="mt-4 pt-4 flex flex-wrap gap-2" style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                    {data.genres.map((g, i) => (
                      <span key={i} className="px-3 py-1 text-xs font-mono rounded-md"
                        style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", color:"rgba(255,255,255,0.5)" }}>
                        {g}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Recommended */}
          <div className="flex flex-col gap-3 max-[1200px]:hidden">
            {data.recommended?.length > 0 && (
              <div className="rounded-xl p-4" style={CARD}>
                <h2 className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-3">More Movies</h2>
                <div className="flex flex-col gap-2">
                  {data.recommended.slice(0, 12).map((m, i) => (
                    <Link key={m.id || i} to={`/movies/${m.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg transition-colors group"
                      style={{ borderRadius: 8 }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <img src={m.poster} alt={m.title}
                        className="w-10 h-14 object-cover rounded flex-shrink-0"
                        style={{ border:"1px solid rgba(255,255,255,0.08)" }}
                        onError={e => { e.target.src = "https://placehold.co/40x56/111/333?text=?"; }} />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-xs font-mono text-white/70 group-hover:text-white transition-colors line-clamp-2">{m.title}</span>
                        {m.year && <span className="text-[10px] font-mono text-white/25">{m.year}</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile recommended */}
          {data.recommended?.length > 0 && (
            <div className="hidden max-[1200px]:block rounded-xl p-4" style={CARD}>
              <h2 className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-3">More Movies</h2>
              <div className="grid grid-cols-3 gap-3">
                {data.recommended.slice(0, 6).map((m, i) => (
                  <Link key={m.id || i} to={`/movies/${m.id}`} className="flex flex-col gap-1 group">
                    <div className="w-full pb-[140%] relative rounded-lg overflow-hidden">
                      <img src={m.poster} alt={m.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={e => { e.target.src = "https://placehold.co/100x140/111/333?text=?"; }} />
                    </div>
                    <span className="text-[10px] font-mono text-white/50 line-clamp-1">{m.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
