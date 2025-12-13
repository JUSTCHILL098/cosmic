import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/src/context/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import useToolTipPosition from "@/src/hooks/useToolTipPosition";
import Qtip from "../qtip/Qtip";

function Trophy({ rank }) {
  const styles = {
    1: {
      bg: "bg-amber-700/20",
      color: "text-amber-500 fill-amber-500",
      glow: "shadow-[0_0_10px_rgba(245,158,11,0.6)]",
    },
    2: {
      bg: "bg-gray-400/20",
      color: "text-gray-300 fill-gray-300",
      glow: "shadow-[0_0_10px_rgba(209,213,219,0.6)]",
    },
    3: {
      bg: "bg-orange-700/20",
      color: "text-orange-500 fill-orange-500",
      glow: "shadow-[0_0_10px_rgba(234,88,12,0.6)]",
    },
  }[rank];

  return (
    <div
      className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full ${styles.bg} ${styles.glow}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="currentColor"
        className={`h-3 w-3 sm:h-4 sm:w-4 ${styles.color} block`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    </div>
  );
}

function Topten({ data, className }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState("today");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  // 🛡️ HARD NORMALIZATION
  const safeData = useMemo(() => {
    if (!data) return { today: [], week: [], month: [] };
    return {
      today: Array.isArray(data.today) ? data.today : [],
      week: Array.isArray(data.week) ? data.week : [],
      month: Array.isArray(data.month) ? data.month : [],
    };
  }, [data]);

  const currentData = safeData[activePeriod];

  const { tooltipPosition, tooltipHorizontalPosition, cardRefs } =
    useToolTipPosition(hoveredItem, currentData);

  if (!currentData.length) return null;

  const handleMouseEnter = (item, index) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoveredItem(`${item.id}-${index}`);
  };

  const handleMouseLeave = () => {
    setHoverTimeout(setTimeout(() => setHoveredItem(null), 250));
  };

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl text-white">Top 10</h1>
        <ul className="flex bg-[#1a1a1a] rounded-lg overflow-hidden">
          {["today", "week", "month"].map((period) => (
            <li
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`cursor-pointer px-4 py-1.5 text-sm transition-all ${
                activePeriod === period
                  ? "bg-white text-black font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {period[0].toUpperCase() + period.slice(1)}
            </li>
          ))}
        </ul>
      </div>

      {/* List */}
      <div className="flex flex-col space-y-3 bg-[#1a1a1a] p-4 rounded-lg">
        {currentData.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => (cardRefs.current[index] = el)}
            className="flex items-center gap-3 relative"
          >
            {/* Rank (FIXED HEIGHT = NO WAVE) */}
            <div className="w-7 h-7 flex items-center justify-center">
              {index < 3 ? (
                <Trophy rank={index + 1} />
              ) : (
                <span className="text-gray-500 font-bold text-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}
            </div>

            <img
              src={item.poster}
              alt={item.title}
              className="w-[55px] h-[70px] rounded-lg object-cover cursor-pointer"
              onClick={() => navigate(`/watch/${item.id}`)}
              onMouseEnter={() => handleMouseEnter(item, index)}
              onMouseLeave={handleMouseLeave}
            />

            {hoveredItem === `${item.id}-${index}` &&
              window.innerWidth > 1024 && (
                <div
                  className={`absolute ${tooltipPosition} ${tooltipHorizontalPosition} z-[9999]`}
                  onMouseEnter={() =>
                    hoverTimeout && clearTimeout(hoverTimeout)
                  }
                  onMouseLeave={handleMouseLeave}
                >
                  <Qtip id={item.id} />
                </div>
              )}

            <div className="flex flex-col ml-2">
              <Link
                to={`/${item.id}`}
                className="text-gray-200 hover:text-white line-clamp-1"
              >
                {language === "EN" ? item.title : item.japanese_title}
              </Link>

              <div className="flex gap-2 mt-1">
                {item.tvInfo?.sub && (
                  <span className="flex items-center gap-1 text-xs text-gray-300">
                    <FontAwesomeIcon icon={faClosedCaptioning} />
                    {item.tvInfo.sub}
                  </span>
                )}
                {item.tvInfo?.dub && (
                  <span className="flex items-center gap-1 text-xs text-gray-300">
                    <FontAwesomeIcon icon={faMicrophone} />
                    {item.tvInfo.dub}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(Topten);
