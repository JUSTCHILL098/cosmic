import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { FaHistory, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLanguage } from "@/src/context/LanguageContext";
import { Play } from "lucide-react";

const ContinueWatching = () => {
  const [watchList, setWatchList] = useState([]);
  const { language } = useLanguage();
  const swiperRef = useRef(null);

  useEffect(() => {
    try {
      const data = JSON.parse(
        localStorage.getItem("continueWatching") || "[]"
      );
      setWatchList(Array.isArray(data) ? data : []);
    } catch {
      setWatchList([]);
    }
  }, []);

  const memoizedWatchList = useMemo(
    () => (Array.isArray(watchList) ? watchList : []),
    [watchList]
  );

  const removeFromWatchList = (episodeId) => {
    setWatchList((prevList) => {
      const safePrev = Array.isArray(prevList) ? prevList : [];
      const updatedList = safePrev.filter(
        (item) => item.episodeId !== episodeId
      );
      localStorage.setItem("continueWatching", JSON.stringify(updatedList));
      return updatedList;
    });
  };

  if (memoizedWatchList.length === 0) return null;

  return (
    <div className="mt-8">
      {/* HEADER */}
      <div className="flex items-center justify-between max-md:pl-4 mb-6">
        <div className="flex items-center gap-x-3">
          <FaHistory className="text-gray-200 text-xl" />
          <h1 className="text-gray-200 text-2xl font-bold tracking-tight max-[450px]:text-xl">
            Continue Watching
          </h1>
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

      {/* SLIDER */}
      <div className="relative mx-auto overflow-hidden z-[1]">
        <Swiper
          ref={swiperRef}
          slidesPerView={3}
          spaceBetween={20}
          breakpoints={{
            640: { slidesPerView: 4 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1300: { slidesPerView: 6 },
            1600: { slidesPerView: 7 },
          }}
          modules={[Navigation]}
          navigation={{
            nextEl: ".continue-btn-next",
            prevEl: ".continue-btn-prev",
          }}
        >
          {memoizedWatchList
            .slice()
            .reverse()
            .map((item, index) => (
              <SwiperSlide
                key={`${item?.episodeId}-${index}`}
                className="flex justify-center"
              >
                <div className="w-full pb-[140%] relative overflow-hidden rounded-lg shadow-lg group bg-black">

                  {/* REMOVE BUTTON */}
                  <button
                    className="absolute top-3 right-3 z-20 bg-black/60 text-gray-300 w-8 h-8 rounded-md hover:bg-white hover:text-black transition"
                    onClick={() => removeFromWatchList(item?.episodeId)}
                  >
                    ✖
                  </button>

                  {/* POSTER */}
                  <Link
                    to={`/watch/${item?.id}?ep=${item?.episodeId}`}
                    className="absolute inset-0"
                  >
                    <img
                      src={item?.poster}
                      alt={item?.title}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105 group-hover:blur-sm"
                    />

                    {/* PLAY OVERLAY */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <div className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                        <Play className="h-5 w-5 text-white fill-white ml-[1px]" />
                      </div>
                    </div>
                  </Link>

                  {/* 18+ TAG (GLASS STYLE) */}
                  {item?.adultContent === true && (
                    <div className="absolute top-3 left-3 z-20">
                      <div
                        className="inline-flex items-center rounded-md px-2.5 py-0.5
                                   font-semibold border shadow backdrop-blur-sm
                                   text-xs sm:text-sm
                                   bg-red-500/10 text-red-600 border-red-500/20"
                      >
                        18+
                      </div>
                    </div>
                  )}

                  {/* BOTTOM INFO */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                    <p className="text-white text-sm font-bold truncate">
                      {language === "EN"
                        ? item?.title
                        : item?.japanese_title}
                    </p>
                    <p className="text-gray-300 text-xs font-medium">
                      Episode {item?.episodeNum}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ContinueWatching;
