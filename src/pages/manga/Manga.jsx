import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { BookOpen, Search, X, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";
import { searchManga, getLatestManga, getLatestRelease } from "@/src/utils/manga.utils";
import "swiper/css";
import "swiper/css/pagination";

const toArr = (d) => {
  if (!d) return [];
  if (Array.isArray(d)) return d;
  for (const k of ["mangas","data","results","items","list","manga"]) {
    if (Array.isArray(d[k])) return d[k];
  }
  return [];
};

// ── Spotlight slide ───────────────────────────────────────────────────────────
function SpotlightSlide({ manga, language, onClick }) {
  const title = language === "EN" ? manga.title : (manga.japanese_title || manga.title);
  return (
    <div className="relative w-full h-full cursor-pointer" onClick={onClick}>
      <img src={manga.image} alt="" className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
      <div className="relative z-10 h-full flex items-end pb-12 px-8 md:px-16 max-w-3xl">
        <div className="flex gap-6 items-end">
          <img src={manga.image} alt={title}
            className="w-[110px] h-[165px] object-cover rounded-xl shadow-2xl flex-shrink-0 border border-white/10 hidden md:block"
            onError={e => { e.target.style.display = "none"; }} />
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {manga.tags?.slice(0, 3).map(t => (
                <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono"
                  style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.65)" }}>
                  {t}
                </span>
              ))}
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tight line-clamp-2">{title}</h1>
            {manga.description && (
              <p className="text-white/45 text-sm leading-relaxed line-clamp-2 max-w-lg">{manga.description}</p>
            )}
            <div className="flex items-center gap-3 mt-1">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm"
                style={{ background:"#fff", color:"#000" }}>
                <BookOpen className="w-4 h-4" /> Read Now
              </button>
              {manga.author && <span className="text-white/35 text-xs font-mono">{manga.author}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Manga card ────────────────────────────────────────────────────────────────
function MangaCard({ manga, language, rank, onClick }) {
  const title = language === "EN" ? manga.title : (manga.japanese_title || manga.title);
  return (
    <div className="flex flex-col cursor-pointer group" onClick={onClick}>
      <div className="w-full pb-[140%] relative rounded-lg overflow-hidden shadow-lg">
        <div className="absolute inset-0">
          <img src={manga.image} alt={title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:blur-sm"
            onError={e => { e.target.src = "https://placehold.co/200x280/111/333?text=No+Cover"; }} />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
          </div>
          {rank && (
            <div className="absolute top-0 left-0 bg-white text-black text-xs font-bold px-1.5 py-0.5 rounded-br">
              #{rank}
            </div>
          )}
        </div>
      </div>
      <p className="text-white font-semibold mt-2 text-sm line-clamp-1">{title}</p>
      {manga.latestChapter && <p className="text-white/35 text-xs mt-0.5 truncate">{manga.latestChapter}</p>}
    </div>
  );
}

// ── Trending item ─────────────────────────────────────────────────────────────
function TrendingItem({ manga, language, rank, onClick }) {
  const title = language === "EN" ? manga.title : (manga.japanese_title || manga.title);
  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group" onClick={onClick}>
      <div className="relative flex-shrink-0">
        <img src={manga.image} alt={title}
          className="w-[50px] h-[70px] rounded object-cover"
          onError={e => { e.target.src = "https://placehold.co/50x70/111/333?text=?"; }} />
        <div className="absolute top-0 left-0 bg-white text-black text-xs font-bold px-1.5 rounded-br">#{rank}</div>
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors line-clamp-2">{title}</span>
        {manga.author && <span className="text-xs text-white/35">{manga.author}</span>}
        {manga.status && <span className="text-xs text-white/25 capitalize">{manga.status}</span>}
      </div>
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ label }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-semibold text-2xl text-white capitalize tracking-wide">{label}</h2>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Manga() {
  const navigate  = useNavigate();
  const { language } = useLanguage();
  const swiperRef = useRef(null);

  const [spotlight, setSpotlight] = useState([]);
  const [latest,    setLatest]    = useState([]);
  const [releases,  setReleases]  = useState([]);
  const [trending,  setTrending]  = useState([]);
  const [query,     setQuery]     = useState("");
  const [results,   setResults]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [searching, setSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page,      setPage]      = useState(1);
  const debRef = useRef(null);

  // Initial load
  useEffect(() => {
    setLoading(true);
    // Fetch latest + releases in parallel, don't let one block the other
    getLatestManga(1)
      .then(lm => {
        const arr = toArr(lm);
        setSpotlight(arr.slice(0, 8));
        setLatest(arr);
        setTrending(arr.slice(0, 12));
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Releases fetched separately so its loading state is independent
    getLatestRelease()
      .then(lr => setReleases(toArr(lr)))
      .catch(() => setReleases([])); // silently fail — don't block page
  }, []);

  // Load more latest
  useEffect(() => {
    if (page === 1) return;
    setLoadingMore(true);
    getLatestManga(page)
      .then(d => setLatest(prev => [...prev, ...toArr(d)]))
      .catch(console.error)
      .finally(() => setLoadingMore(false));
  }, [page]);

  // Search debounce
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    clearTimeout(debRef.current);
    debRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const d = await searchManga(query.trim());
        setResults(toArr(d));
      } catch { setResults([]); }
      finally { setSearching(false); }
    }, 400);
    return () => clearTimeout(debRef.current);
  }, [query]);

  const goTo = (id) => navigate(`/manga/${encodeURIComponent(id)}`);

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
                <SpotlightSlide manga={m} language={language} onClick={() => goTo(m.id)} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <div className="pt-8 px-4 lg:px-10">

        {/* ── SEARCH ── */}
        <div className="relative mb-8 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
          <input type="text" placeholder="Search manga..." value={query}
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
            <SectionHeader label={`Results for "${query}"`} />
            {searching ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-white/25 font-mono text-sm">No results found</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-3 gap-y-8">
                {results.map((m, i) => (
                  <MangaCard key={m.id || i} manga={m} language={language} onClick={() => goTo(m.id)} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ── HOME LAYOUT ── */
          <div className="w-full grid grid-cols-[75%,25%] gap-x-6 max-[1200px]:flex max-[1200px]:flex-col">

            {/* LEFT */}
            <div>
              {/* Latest Manga — show all 48 */}
              <div className="mt-4">
                <SectionHeader label="Latest Manga" />
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-3 gap-y-8">
                  {latest.map((m, i) => (
                    <MangaCard key={m.id || i} manga={m} language={language} onClick={() => goTo(m.id)} />
                  ))}
                </div>
                {/* Load more */}
                <div className="flex justify-center mt-8">
                  <button onClick={() => setPage(p => p + 1)} disabled={loadingMore}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono text-sm transition-all disabled:opacity-40"
                    style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)" }}>
                    {loadingMore
                      ? <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                      : "Load More"}
                  </button>
                </div>
              </div>

              {/* New Releases — only render when data is ready, no spinner */}
              {releases.length > 0 && (
                <div className="mt-12">
                  <SectionHeader label="New Releases" />
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-3 gap-y-8">
                    {releases.map((m, i) => (
                      <MangaCard key={m.id || i} manga={m} language={language} onClick={() => goTo(m.id)} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT — Trending */}
            <div className="w-full mt-4">
              <div className="rounded-lg p-4" style={{ background:"#000" }}>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-white" />
                  <h2 className="text-xl font-semibold text-white">Trending Manga</h2>
                </div>
                <div className="flex flex-col space-y-1 max-h-[700px] overflow-y-auto pr-1 scrollbar-hide">
                  {trending.map((m, i) => (
                    <TrendingItem key={m.id || i} manga={m} language={language} rank={i + 1} onClick={() => goTo(m.id)} />
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
