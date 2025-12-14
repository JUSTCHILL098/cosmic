import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Banner from "../banner/Banner";

export default function Spotlight({ spotlights = [] }) {
  return (
    <div className="relative h-[500px] max-md:h-[360px] -mt-8">

      <Swiper
        slidesPerView={1}
        loop
        autoplay={{ delay: 5000 }}
        navigation={{
          nextEl: ".next-btn",
          prevEl: ".prev-btn",
        }}
        pagination={{ clickable: true }}
        modules={[Navigation, Autoplay, Pagination]}
        className="h-full rounded-2xl"
      >
        {/* ARROWS */}
        <button className="prev-btn absolute left-4 top-1/2 -translate-y-1/2 z-50
                           h-9 w-9 rounded-full bg-black/50
                           flex items-center justify-center">
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>

        <button className="next-btn absolute right-4 top-1/2 -translate-y-1/2 z-50
                           h-9 w-9 rounded-full bg-black/50
                           flex items-center justify-center">
          <ChevronRight className="h-5 w-5 text-white" />
        </button>

        {spotlights.map((item, i) => (
          <SwiperSlide key={item.id ?? i}>
            <Banner item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
