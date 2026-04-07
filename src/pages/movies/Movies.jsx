import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Play, Star, Search, X, ArrowLeft, ArrowRight, Film, TrendingUp, Clock, Award } from "lucide-react";
import { getTrending, getPopular, getNowPlaying, getTopRated, getUpcoming, searchMovies } from "@/src/utils/movies.utils";
import "swiper/css";
import "swiper/css/pagination";

// ── Spotlight banner ──────────────────────────────────────────────────────────
function SpotlightSlide({ movie, onClick }) {
  return (
    <div className="relative w-full h-full cursor-pointer" onClick={onClick}>
      {movie.backdrop
        ? <img src={movie.backdrop} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        : <img src={movie.poster} alt="" className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-40" />}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
      <div className="relative z-10 h-full flex items-end pb-12 px-8 md:px-16 max-w-3xl">
        <div className="flex gap-6 items-end">
          <img src={movie.poster} alt={movie.title}
            className="w-[110px] h-[165px] object-cover rounded-xl shadow-2xl flex-shrink-0 border border-white/10 hidden md:block"
            onError={e => { e.target.style.display = "none"; }} />
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono"
                style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.7)" }}>
                <Star className="w-3 h-3" /> {movie.rating}
              </span>
              {movie.year && <span className="text-white/40 text-xs font-mono">{movie.year}</span>}
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tight line-clamp-2">{movie.title}</h1>
            {movie.overview && (
              <p className="text-white/45 text-sm leading-relaxed line-clamp-2 max-w-lg">{movie.overview}</p>
            )}
            <div className="flex items-center gap-3 mt-1">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm"
                style={{ background:"#fff", color:"#000" }}>
                <Play className="w-4 h-4 fill-current" /> Watch Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Movie card (same as CategoryCard style) ───────────────────────────────────
function MovieCard({ movie, rank, onClick }) {
  return (
    <div className="flex flex-col cursor-pointer group" onClick={onClick}>
      <div className="w-full pb-[140%] relative rounded-lg overflow-hidden shadow-lg">
        <div className="absolute inset-0">
          <img src={movie.poster} alt={movie.title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:blur-sm"
            onError={e => { e.target.src = "https://placehold.co/200x280/111/333?text=No+Poster"; }} />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
              <Play className="h-4 w-4 text-white fill-white ml-[1px]" />
            </div>
          </div>
          {rank && (
            <div className="absolute top-0 left-0 bg-white text-black text-xs font-bold px-1.5 py-0.5 rounded-br">
              #{rank}
            </div>
          )}
          {movie.rating && movie.rating !== "N/A" && (
            <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold"
              style={{ background:"rgba(0,0,0,0.7)", color:"#fbbf24" }}>
              <Star className="w-2.5 h-2.5 fill-current" /> {movie.rating}
            </div>
          )}
        </div>
      </div>
      <p className="text-white font-semibold mt-2 text-sm line-clamp-1">{movie.title}</p>
      {movie.year && <p className="text-white/35 text-xs mt-0.5">{movie.year}</p>}
    </div>
  );
}

// ── Trending sidebar item ─────────────────────────────────────────────────────
function TrendingItem({ movie, rank, onClick }) {
  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group" onClick={onClick}>
      <div className="relative flex-shrink-0">
        <img src={movie.poster} alt={movie.title}
          className="w-[50px] h-[70px] rounded object-cover"
          onError={e => { e.target.src = "https://placehold.co/50x70/111/333?text=?"; }} />
        <div className="absolute top-0 left-0 bg-white text-black text-xs font-bold px-1.5 rounded-br">#{rank}</div>
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors line-clamp-2">{movie.title}</span>
        <div className="flex items-center gap-2">
          {movie.rating !== "N/A" && (
            <span className="flex items-center gap-0.5 text-[10px] text-yellow-400">
              <Star className="w-2.5 h-2.5 fill-current" /> {movie.rating}
            </span>
          )}
          {movie.year && <span className="text-xs text-white/30">{movie.year}</span>}
        </div>
      </div>
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ label, icon: Icon }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Icon && <Icon className="w-5 h-5 text-white/60" />}
      <h2 className="font-semibold text-2xl text-white capitalize tracking-wide">{label}</h2>
    </div>
  );
}

// ── Tabbed section (like TabbedAnimeSection) ──────────────────────────────────
function TabbedSection({ tabs, language }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  return (
    <div className="mt-8">
      <div className="flex items-center gap-1 mb-6 border-b border-white/[0.08]">
        {tabs.map((t, i) => (
          <button key={t.label} onClick={() => setActive(i)}
            className="px-4 py-2 text-sm font-semibold transition-all relative"
            style={{ color: active === i ? "#fff" : "rgba(255,255,255,0.35)" }}>
            {t.label}
            {active === i && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-3 gap-y-8">
        {(tabs[active]?.data || []).slice(0, 12).map((m, i) => (
          <MovieCard key={m.id || i} movie={m} onClick={() => navigate(`/movies/${m.id}`)} />
        ))}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Movies() {
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  const [spotlight,   setSpotlight]   = useState([]);
  const [popular,     setPopular]     = useState([]);
  const [nowPlaying,  setNowPlaying]  = useState([]);
  const [topRated,    setTopRated]    = useState([]);
  const [upcoming,    setUpcoming]    = useState([]);
  const [trending,    setTrending]    = useState([]);
  const [query,       setQuery]       = useState("");
  const [results,     setResults]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [searching,   setSearching]   = useState(false);
  const debRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getTrending(1),
      getPopular(1),
      getNowPlaying(1),
      getTopRated(1),
      getUpcoming(1),
    ]).then(([tr, pop, now, top, up]) => {
      setSpotlight(tr.results.slice(0, 8));
      setTrending(tr.results.slice(0, 12));
      setPopular(pop.results);
      setNowPlaying(now.results);
      setTopRated(top.results);
      setUpcoming(up.results);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Search debounce
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    clearTimeout(debRef.current);
    debRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const d = await searchMovies(query.trim());
        setResults(d.results || []);
      } catch { setResults([]); }
      finally { setSearching(false); }
    }, 400);
    return () => clearTimeout(debRef.current);
  }, [query]);

  const goTo = (id) => navigate(`/movies/${id}`);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:"#000" }}>
      <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pb-24" style={{ background:"#000", color:"#fff" }}>

      {/* ── SPOTLIGHT ── */}
      {spotlight.length > 0 && !query && (
        <div className="relative h-[500px] max-md:h-[360px] -mt-8 -mx-4 lg:-mx-10">
          <Swiper
            onSwiper={s => { swiperRef.current = s; }}
            slidesPerView={1} loop
            autoplay={{ delay:5000, disableOnInteraction:false }}
            pagination={{ clickable:true }}
            modules={[Autoplay, Pagination]}
            className="h-full"
          >
            <button type="button" onClick={() => swiperRef.current?.slidePrev()}
              className="hidden md:inline-flex items-center justify-center h-8 w-8 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors absolute left-4 top-1/2 -translate-y-1/2 z-50">
              <ArrowLeft className="h-4 w-4 text-white" />
            </button>
            <button type="button" onClick={() => swiperRef.current?.slideNext()}
              className="hidden md:inline-flex items-center justify-center h-8 w-8 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors absolute right-4 top-1/2 -translate-y-1/2 z-50">
              <ArrowRight className="h-4 w-4 text-white" />
            </button>
            {spotlight.map((m, i) => (
              <SwiperSlide key={m.id || i} className="h-full">
                <SpotlightSlide movie={m} onClick={() => goTo(m.id)} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <div className="pt-8 px-4 lg:px-10">

        {/* ── SEARCH ── */}
        <div className="relative mb-8 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
          <input type="text" placeholder="Search movies..." value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 text-sm text-white font-mono outline-none transition-colors placeholder:text-white/20 rounded-xl"
            style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)" }}
            onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.3)"}
            onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── SEARCH RESULTS ── */}
        {query.trim() ? (
          <div>
            <SectionHeader label={`Results for "${query}"`} icon={Search} />
            {searching ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-20">
                <Film className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-white/25 font-mono text-sm">No results found</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-3 gap-y-8">
                {results.map((m, i) => <MovieCard key={m.id || i} movie={m} onClick={() => goTo(m.id)} />)}
              </div>
            )}
          </div>
        ) : (
          /* ── HOME LAYOUT ── */
          <div className="w-full grid grid-cols-[75%,25%] gap-x-6 max-[1200px]:flex max-[1200px]:flex-col">

            {/* LEFT */}
            <div>
              {/* Now Playing */}
              <div className="mt-4">
                <SectionHeader label="Now Playing" icon={Film} />
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-3 gap-y-8">
                  {nowPlaying.slice(0, 12).map((m, i) => (
                    <MovieCard key={m.id || i} movie={m} onClick={() => goTo(m.id)} />
                  ))}
                </div>
              </div>

              {/* Tabbed: Popular / Top Rated / Upcoming */}
              <TabbedSection tabs={[
                { label: "Most Popular", data: popular },
                { label: "Top Rated",    data: topRated },
                { label: "Upcoming",     data: upcoming },
              ]} />
            </div>

            {/* RIGHT — Trending sidebar */}
            <div className="w-full mt-4">
              <div className="rounded-lg p-4" style={{ background:"#000" }}>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-white" />
                  <h2 className="text-xl font-semibold text-white">Trending This Week</h2>
                </div>
                <div className="flex flex-col space-y-1 max-h-[700px] overflow-y-auto pr-1 scrollbar-hide">
                  {trending.map((m, i) => (
                    <TrendingItem key={m.id || i} movie={m} rank={i + 1} onClick={() => goTo(m.id)} />
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
