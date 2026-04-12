import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star, Clock, Calendar, Play, Film, ChevronLeft, Loader } from "lucide-react";
import { getMovieDetail, getMovieSources } from "@/src/utils/movies.utils";
import Player from "@/src/components/player/Player";
import BouncingLoader from "@/src/components/ui/bouncingloader/Bouncingloader";

const SERVERS = ["vidcloud", "akcloud", "upcloud"];

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [isFull,     setIsFull]     = useState(false);
  const [playing,    setPlaying]    = useState(false);
  const [streamUrl,  setStreamUrl]  = useState(null);
  const [subtitles,  setSubtitles]  = useState([]);
  const [streamErr,  setStreamErr]  = useState(null);
  const [streamLoad, setStreamLoad] = useState(false);
  const [server,     setServer]     = useState("vidcloud");

  useEffect(() => {
    setLoading(true);
    getMovieDetail(decodeURIComponent(id))
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const loadStream = async (srv = server) => {
    if (!data) return;
    setStreamLoad(true);
    setStreamErr(null);
    setStreamUrl(null);
    try {
      const epId = data.episodeId || data.id;
      const src  = await getMovieSources(epId, srv);
      const m3u8 = src.sources?.find(s => s.isM3u8 || s.type === "hls")?.url || src.sources?.[0]?.url;
      if (!m3u8) throw new Error("No stream found");
      const subs = (src.subtitles || []).map(s => ({ file: s.url, label: s.lang || "English", kind: "subtitles", default: s.default }));
      setStreamUrl(m3u8);
      setSubtitles(subs);
      setPlaying(true);
    } catch (e) {
      setStreamErr(e.message);
    } finally {
      setStreamLoad(false);
    }
  };

  const switchServer = (srv) => {
    setServer(srv);
    if (playing) loadStream(srv);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:"#000" }}>
      <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
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
    <div className="min-h-screen pb-24 text-white" style={{ background:"#000" }}>

      {/* ── PLAYER (shown when playing) ── */}
      {playing && (
        <div className="w-full" style={{ background:"#000" }}>
          <div className="w-full max-w-[1400px] mx-auto px-4 pt-16">
            <button onClick={() => setPlaying(false)}
              className="flex items-center gap-1.5 text-white/30 hover:text-white font-mono text-xs mb-3 transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" /> Back to details
            </button>
            <div className="rounded-xl overflow-hidden" style={{ border:"1px solid rgba(255,255,255,0.09)" }}>
              <div className="w-full relative aspect-video bg-black">
                {streamLoad ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <BouncingLoader />
                  </div>
                ) : streamUrl ? (
                  <Player streamUrl={streamUrl} subtitles={subtitles} onMediaError={() => setStreamErr("Playback error — try another server")} />
                ) : streamErr ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black">
                    <p className="text-white/40 font-mono text-sm">{streamErr}</p>
                    <button onClick={() => loadStream(server)} className="text-white/60 hover:text-white font-mono text-xs underline">Retry</button>
                  </div>
                ) : null}
              </div>
              {/* Server switcher */}
              <div className="px-4 py-3 flex items-center gap-2" style={{ background:"#0a0a0a", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider mr-2">Server</span>
                {SERVERS.map(s => (
                  <button key={s} onClick={() => switchServer(s)}
                    className="px-3 py-1 rounded-md text-[11px] font-mono transition-all"
                    style={{
                      background: server === s ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                      border: server === s ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.07)",
                      color: server === s ? "#fff" : "rgba(255,255,255,0.4)",
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BANNER (hidden when playing) ── */}
      {!playing && (
        <>
          <div className="relative w-full h-[340px] md:h-[420px] overflow-hidden mt-[64px] max-md:mt-[50px]">
            {data.backdrop
              ? <img src={data.backdrop} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
              : <img src={data.poster} alt="" className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-25" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 -mt-[260px] md:-mt-[320px]">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
              {/* Poster */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="relative w-[160px] md:w-[220px] aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                  <img src={data.poster} alt={data.title} className="w-full h-full object-cover"
                    onError={e => { e.target.src = "https://placehold.co/220x330/111/333?text=No+Poster"; }} />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 pt-2 md:pt-[180px]">
                <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight mb-2">{data.title}</h1>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {data.rating !== "N/A" && data.rating && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.07] border border-white/10 text-xs font-mono text-white/80">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {data.rating}
                    </span>
                  )}
                  {data.duration && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.07] border border-white/10 text-xs font-mono text-white/80">
                      <Clock className="w-3 h-3" /> {data.duration}
                    </span>
                  )}
                  {data.year && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.07] border border-white/10 text-xs font-mono text-white/80">
                      <Calendar className="w-3 h-3" /> {data.year}
                    </span>
                  )}
                  {data.quality && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/[0.07] border border-white/10 text-xs font-mono text-white/80">
                      {data.quality}
                    </span>
                  )}
                </div>

                {/* Watch button */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={() => { setPlaying(true); if (!streamUrl) loadStream(); }}
                    disabled={streamLoad}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-gray-100 rounded-md text-black font-semibold text-sm transition-all font-mono disabled:opacity-60"
                  >
                    {streamLoad ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                    {streamLoad ? "Loading..." : "Watch Now"}
                  </button>
                </div>

                {streamErr && !playing && (
                  <p className="text-red-400 font-mono text-xs mb-4">{streamErr} — try a different server below</p>
                )}

                {/* Overview */}
                {overview && (
                  <div className="mb-6">
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
                      {isFull || overview.length <= 300 ? overview : `${overview.slice(0, 300)}…`}
                      {overview.length > 300 && (
                        <button onClick={() => setIsFull(v => !v)}
                          className="ml-2 text-white/60 hover:text-white text-xs font-mono transition-colors">
                          {isFull ? "Show less" : "Read more"}
                        </button>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Meta + genres */}
            <div className="mt-8 rounded-xl p-5" style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">Details</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                {[
                  { label:"Type",       value: data.type },
                  { label:"Country",    value: data.country },
                  { label:"Production", value: data.production },
                  { label:"Quality",    value: data.quality },
                ].filter(m => m.value).map(m => (
                  <div key={m.label}>
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-0.5">{m.label}</p>
                    <p className="text-xs font-mono text-white/80">{m.value}</p>
                  </div>
                ))}
              </div>
              {data.genres?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-3">Genres</p>
                  <div className="flex flex-wrap gap-2">
                    {data.genres.map((g, i) => (
                      <span key={i} className="px-3 py-1 text-xs font-mono rounded-md"
                        style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", color:"rgba(255,255,255,0.6)" }}>
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
