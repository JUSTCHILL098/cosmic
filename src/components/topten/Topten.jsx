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

/* 🏆 Trophy SVG (exactly as requested) */
const TrophyIcon = ({ color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={color}
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
    aria-hidden="true"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

function Topten({ data, className }) {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [activePeriod, setActivePeriod] = useState("today");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  /* 🛡 SAFE DATA */
  const safeData = useMemo(() => {
    return {
      today: Array.isArray(data?.today) ? data.today : [],
      week: Array.isArray(data?.week) ? data.week : [],
      month: Array.isArray(data?.month) ? data.month : [],
    };
  }, [data]);

  const currentData = safeData[activePeriod];

  const {
    tooltipPosition,
    tooltipHorizontalPosition,
    cardRefs,
  } = useToolTipPosition(hoveredItem, currentData);

  if (!currentData.length) {
    return (
      <div className={`text-gray-400 mt-12 ${className}`}>
        Top 10 not available
      </div>
    );
  }

  const handleMouseEnter = (item, index) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoveredItem(`${item.id}-${index}`);
  };

  const handleMouseLeave = () => {
    setHoverTimeout(setTimeout(() => setHoveredItem(null), 250));
  };

  const trophyColors = ["#EAB308", "#9CA3AF", "#CD7F32"]; // Gold, Silver, Bronze

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
            {/* 🏆 Rank */}
            <div className="w-6 flex justify-center">
              {index < 3 ? (
                <TrophyIcon color={trophyColors[index]} />
              ) : (
                <span className="text-gray-500 font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}
            </div>

            {/* Poster */}
            <img
              src={item.poster}
              alt={item.title}
              className="w-[55px] h-[70px] rounded-lg object-cover cursor-pointer"
              onClick={() => navigate(`/watch/${item.id}`)}
              onMouseEnter={() => handleMouseEnter(item, index)}
              onMouseLeave={handleMouseLeave}
            />

            {/* Tooltip */}
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

            {/* Info */}
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
