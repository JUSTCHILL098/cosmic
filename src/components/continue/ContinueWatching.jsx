import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { FaHistory, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLanguage } from "@/src/context/LanguageContext";
import { Play, X } from "lucide-react";

const fmt = (s) => {
  if (!s || s <= 0) return "";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const ContinueWatching = () => {
  const [watchList, setWatchList] = useState([]);
  const { language } = useLanguage();

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("continueWatching") || "[]");
      setWatchList(Array.isArray(data) ? data : []);
    } catch { setWatchList([]); }
  }, []);

  const list = useMemo(() => (Array.isArray(watchList) ? watchList : []), [watchList]);

  const remove = (episodeId) => {
    setWatchList(prev => {
      const updated = prev.filter(i => i.episodeId !== episodeId);
      localStorage.setItem("continueWatching", JSON.stringify(updated));
      return updated;
    });
  };

  if (list.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between max-md:pl-4 mb-6">
        <div className="flex items-center gap-x-3">
          <FaHistory className="text-gray-200 text-xl" />
          <h1 className="text-gray-200 text-2xl font-bold tracking-tight max-[450px]:text-xl">Continue Watching</h1>
        </div>
        <div className="flex gap-x-3 pr-2 max-[350px]:hidden">
          <button className="continue-btn-prev bg-black text-gray-300 p-3 rounded-lg hover:text-white transition">
            <FaChevronLeft className="text-sm" />
          </button>
          <button className="continue-btn-next bg-black text-gray-300 p-3 rounded-lg hover:text-white transition">
            <FaChevronRight className="text-sm" />
          </button>
        </div>
      </div>

      <div className="relative mx-auto overflow-hidden z-[1]">
        <Swiper
          slidesPerView={1.5}
          spaceBetween={14}
          breakpoints={{
            480:  { slidesPerView: 2 },
            640:  { slidesPerView: 2.5 },
            768:  { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1300: { slidesPerView: 5 },
            1600: { slidesPerView: 6 },
          }}
          modules={[Navigation]}
          navigation={{ nextEl: ".continue-btn-next", prevEl: ".continue-btn-prev" }}
        >
          {list.slice().reverse().map((item, index) => {
            const progress = item.currentTime && item.duration && item.duration > 0
              ? Math.min((item.currentTime / item.duration) * 100, 100)
              : 0;
            const remaining = item.duration && item.currentTime
              ? Math.max(0, item.duration - item.currentTime)
              : null;

            return (
              <SwiperSlide key={`${item?.episodeId}-${index}`} className="flex justify-center">
                <div className="w-full group relative rounded-xl overflow-hidden bg-black"
                  style={{ aspectRatio: "16/9", border: "1px solid rgba(255,255,255,0.07)" }}>

                  {/* Remove button */}
                  <button
                    className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full flex items-center justify-center transition-all"
                    style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.1)" }}
                    onClick={() => remove(item?.episodeId)}
                    aria-label="Remove"
                  >
                    <X className="w-3 h-3 text-white/70" />
                  </button>

                  {/* Glass 18+ badge */}
                  {item?.adultContent && (
                    <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-md text-[9px] font-bold text-red-300"
                      style={{
                        background: "rgba(239,68,68,0.15)",
                        border: "1px solid rgba(239,68,68,0.3)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                      }}>
                      18+
                    </div>
                  )}

                  {/* Poster + play overlay */}
                  <Link to={`/watch/${item?.id}?ep=${item?.episodeId}`} className="absolute inset-0">
                    <img src={item?.poster} alt={item?.title}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105 group-hover:brightness-50" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)" }}>
                        <Play className="h-4 w-4 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  </Link>

                  {/* Bottom overlay */}
                  <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)" }}>
                    {/* Progress bar */}
                    {progress > 0 && (
                      <div className="px-2 pt-3">
                        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
                          <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "#fff" }} />
                        </div>
                        {/* Time indicators */}
                        <div className="flex justify-between mt-1.5">
                          <span className="text-[11px] font-mono font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                            {fmt(item.currentTime)}
                          </span>
                          {remaining !== null && (
                            <span className="text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                              -{fmt(remaining)}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="px-2 pb-2.5 pt-0.5">
                      <p className="text-white/70 text-xs font-mono truncate font-semibold">
                        {language === "EN" ? item?.title : (item?.japanese_title || item?.title)}
                      </p>
                      {item?.episodeNum && (
                        <p className="text-white/35 text-[10px] font-mono mt-0.5">Episode {item.episodeNum}</p>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default ContinueWatching;
