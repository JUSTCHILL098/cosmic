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
            dynamicBullets: false,
          }}
          autoplay={{
            delay: 5000, // slower carousel (5s)
            disableOnInteraction: false,
          }}
          modules={[Navigation, Autoplay, Pagination]}
          className="h-full rounded-2xl relative"
        >
          {/* NEW modern arrow buttons */}
          <button
            className="button-prev absolute left-4 top-1/2 -translate-y-1/2 z-[50] 
            w-10 h-10 flex items-center justify-center rounded-full 
            bg-black/40 text-white/90 cursor-pointer backdrop-blur-sm shadow"
          >
            <span className="text-2xl">❮</span>
          </button>

          <button
            className="button-next absolute right-4 top-1/2 -translate-y-1/2 z-[50]
            w-10 h-10 flex items-center justify-center rounded-full 
            bg-black/40 text-white/90 cursor-pointer backdrop-blur-sm shadow"
          >
            <span className="text-2xl">❯</span>
          </button>

          {spotlights.map((item, index) => (
            <SwiperSlide
              key={item.id ?? index}
              className="relative w-full h-full !overflow-visible"
            >
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
