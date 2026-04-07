import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Clock, Calendar, Play, Film } from "lucide-react";
import { getMovieDetail, poster, backdrop } from "@/src/utils/movies.utils";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [isFull,  setIsFull]  = useState(false);

  useEffect(() => {
    setLoading(true);
    getMovieDetail(id)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:"#000" }}>
      <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background:"#000" }}>
      <p className="text-white/30 font-mono text-sm">Failed to load movie</p>
      <button onClick={() => navigate("/movies")} className="text-white/50 hover:text-white font-mono text-xs underline">← Back to Movies</button>
    </div>
  );

  const bg       = backdrop(data.backdrop_path);
  const img      = poster(data.poster_path);
  const overview = data.overview || "";
  const trailer  = data.videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube");
  const cast     = data.credits?.cast?.slice(0, 10) || [];
  const similar  = data.similar?.results?.slice(0, 6) || [];
  const runtime  = data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : null;

  return (
    <div className="min-h-screen pb-24 text-white" style={{ background:"#000" }}>

      {/* Banner */}
      <div className="relative w-full h-[340px] md:h-[420px] overflow-hidden mt-[64px] max-md:mt-[50px]">
        {bg
          ? <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
          : <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-25" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 -mt-[260px] md:-mt-[320px]">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">

          {/* Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="relative w-[160px] md:w-[220px] aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
              <img src={img} alt={data.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-2 md:pt-[180px]">
            <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight mb-1">{data.title}</h1>
            {data.original_title !== data.title && (
              <p className="text-white/40 text-sm mb-4 font-mono">{data.original_title}</p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {data.vote_average > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.07] border border-white/10 text-xs font-mono text-white/80">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {data.vote_average.toFixed(1)}
                </span>
              )}
              {runtime && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.07] border border-white/10 text-xs font-mono text-white/80">
                  <Clock className="w-3 h-3" /> {runtime}
                </span>
              )}
              {data.release_date && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.07] border border-white/10 text-xs font-mono text-white/80">
                  <Calendar className="w-3 h-3" /> {data.release_date.slice(0, 4)}
                </span>
              )}
              {data.genres?.map(g => (
                <span key={g.id} className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/[0.07] border border-white/10 text-xs font-mono text-white/80">
                  {g.name}
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              {trailer ? (
                <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-gray-100 rounded-md text-black font-semibold text-sm transition-all font-mono">
                  <Play className="w-4 h-4 fill-current" /> Watch Trailer
                </a>
              ) : (
                <div className="inline-flex items-center px-6 py-2.5 bg-zinc-800 rounded-md text-zinc-400 text-sm font-mono">
                  No Trailer Available
                </div>
              )}
            </div>

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

        {/* Meta grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">
          <div className="rounded-xl p-5" style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">Details</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
              {[
                { label:"Status",    value: data.status },
                { label:"Budget",    value: data.budget > 0 ? `$${(data.budget/1e6).toFixed(0)}M` : null },
                { label:"Revenue",   value: data.revenue > 0 ? `$${(data.revenue/1e6).toFixed(0)}M` : null },
                { label:"Language",  value: data.original_language?.toUpperCase() },
                { label:"Country",   value: data.production_countries?.[0]?.name },
                { label:"Studio",    value: data.production_companies?.[0]?.name },
              ].filter(m => m.value).map(m => (
                <div key={m.label}>
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-0.5">{m.label}</p>
                  <p className="text-xs font-mono text-white/80">{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cast */}
          {cast.length > 0 && (
            <div className="rounded-xl p-5 h-fit" style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">Top Cast</h3>
              <div className="flex flex-col gap-2">
                {cast.slice(0, 6).map(c => (
                  <div key={c.id} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-white/10">
                      {c.profile_path
                        ? <img src={`https://image.tmdb.org/t/p/w45${c.profile_path}`} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-[10px] text-white/30">{c.name[0]}</div>}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-white/70 truncate">{c.name}</p>
                      <p className="text-[10px] font-mono text-white/30 truncate">{c.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Similar movies */}
        {similar.length > 0 && (
          <div className="mt-10 pb-24">
            <h2 className="text-base font-bold font-mono text-white/70 uppercase tracking-widest mb-4">Similar Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {similar.map((m, i) => (
                <Link to={`/movies/${m.id}`} key={i}
                  className="flex flex-col cursor-pointer group">
                  <div className="w-full pb-[140%] relative rounded-lg overflow-hidden">
                    <div className="absolute inset-0">
                      <img src={poster(m.poster_path)} alt={m.title}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:blur-sm"
                        onError={e => { e.target.src = "https://placehold.co/200x280/111/333?text=?"; }} />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                          <Play className="h-4 w-4 text-white fill-white ml-[1px]" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-white font-semibold mt-2 text-xs line-clamp-1">{m.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
