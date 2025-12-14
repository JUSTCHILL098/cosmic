import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";

import Banner from "../banner/Banner";
import "./Spotlight.css";

export default function Spotlight({ spotlights = [] }) {
  const swiperRef = useRef(null);

  if (!spotlights.length) return null;

  return (
    <div className="relative h-[500px] max-md:h-[360px] -mt-8">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        slidesPerView={1}
        loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
        className="h-full rounded-2xl overflow-hidden"
      >
        {/* LEFT ARROW */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          className="inline-flex items-center justify-center
                     h-8 w-8 rounded-full
                     border border-white/20
                     bg-black/40 backdrop-blur-sm
                     shadow-sm
                     hover:bg-black/60
                     transition-colors
                     absolute left-4 top-1/2 -translate-y-1/2 z-50"
          aria-label="Previous slide"
        >
          <ArrowLeft className="h-4 w-4 text-white" />
        </button>

        {/* RIGHT ARROW */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          className="inline-flex items-center justify-center
                     h-8 w-8 rounded-full
                     border border-white/20
                     bg-black/40 backdrop-blur-sm
                     shadow-sm
                     hover:bg-black/60
                     transition-colors
                     absolute right-4 top-1/2 -translate-y-1/2 z-50"
          aria-label="Next slide"
        >
          <ArrowRight className="h-4 w-4 text-white" />
        </button>

        {spotlights.map((item, index) => (
          <SwiperSlide key={item.id ?? index} className="h-full">
            <Banner item={item} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
