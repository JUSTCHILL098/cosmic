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
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Autoplay, Pagination]}
          className="h-full rounded-2xl relative"
          style={{
            "--swiper-pagination-bullet-inactive-color": "rgba(255, 255, 255, 0.5)",
            "--swiper-pagination-bullet-inactive-opacity": "1",
          }}
        >
          {/* translucent vertically-centered nav buttons */}
          <button
            className="button-prev absolute left-4 top-1/2 -translate-y-1/2 z-[50] w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white/90 cursor-pointer shadow"
            aria-label="Previous"
          >
            ‹
          </button>

          <button
            className="button-next absolute right-4 top-1/2 -translate-y-1/2 z-[50] w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white/90 cursor-pointer shadow"
            aria-label="Next"
          >
            ›
          </button>

          {spotlights.map((item, index) => (
            <SwiperSlide
              className="text-black relative !overflow-visible w-full h-full"
              key={item.id ?? index}
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
s
