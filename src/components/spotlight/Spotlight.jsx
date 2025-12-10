// weeb/src/components/spotlight/Spotlight.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Spotlight.css";
import Banner from "../banner/Banner";

const Spotlight = ({ spotlights = [] }) => {
  return (
    <div className="relative h-[450px] max-[1390px]:h-[400px] max-[1300px]:h-[350px] max-md:h-[300px] -mt-8">
      {spotlights.length > 0 ? (
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          allowTouchMove={false}
          navigation={{
            nextEl: ".button-next",
            prevEl: ".button-prev",
          }}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Autoplay, Pagination]}
          className="h-full rounded-2xl relative"
        >

          {/* Left (Previous) Button */}
          <button
            className="button-prev inline-flex items-center justify-center gap-2
            whitespace-nowrap text-sm font-medium transition-colors
            border border-white/20 bg-black/40 backdrop-blur-sm hover:bg-white/20
            text-white h-8 w-8 rounded-full absolute left-4 top-1/2 -translate-y-1/2 z-[50]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="h-4 w-4 rotate-180">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>

          {/* Right (Next) Button */}
          <button
            className="button-next inline-flex items-center justify-center gap-2
            whitespace-nowrap text-sm font-medium transition-colors
            border border-white/20 bg-black/40 backdrop-blur-sm hover:bg-white/20
            text-white h-8 w-8 rounded-full absolute right-4 top-1/2 -translate-y-1/2 z-[50]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="h-4 w-4">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>

          {spotlights.map((item, index) => (
            <SwiperSlide key={item.id ?? index} className="relative !overflow-visible">
              <Banner item={item} index={index} />
            </SwiperSlide>
          ))}

        </Swiper>
      ) : (
        <p className="text-white">No spotlights to show.</p>
      )}
    </div>
  );
};

export default Spotlight;
