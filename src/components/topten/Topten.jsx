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

/* 🏆 Trophy icon (NO glow, fixed size) */
function Trophy({ rank }) {
  const colors = {
    1: "text-yellow-500 fill-yellow-500 bg-yellow-500/15",
    2: "text-gray-300 fill-gray-300 bg-gray-400/15",
    3: "text-orange-500 fill-orange-500 bg-orange-500/15",
  }[rank];

  return (
    <div className={`w-7 h-7 flex items-center justify-center rounded-full ${colors}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 block"
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

  /* 🛡 HARD NORMALIZATION */
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
        <ul className="flex bg-black rounded-lg overflow-hidden border border-white/10">
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

      {/* List (TRUE BLACK, NO WAVE) */}
      <div className="flex flex-col bg-black rounded-lg border border-white/10">
        {currentData.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => (cardRefs.current[index] = el)}
            className="flex items-center gap-3 px-3 py-3 h-[88px] border-b border-white/5 last:border-b-0"
          >
            {/* Rank column — FIXED HEIGHT */}
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
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
              className="w-[55px] h-[70px] rounded-lg object-cover shrink-0 cursor-pointer"
              onClick={() => navigate(`/watch/${item.id}`)}
              onMouseEnter={() => handleMouseEnter(item, index)}
              onMouseLeave={handleMouseLeave}
            />

            {hoveredItem === `${item.id}-${index}` &&
              window.innerWidth > 1024 && (
                <div
                  className={`absolute ${tooltipPosition} ${tooltipHorizontalPosition} z-[9999]`}
                  onMouseEnter={() => hoverTimeout && clearTimeout(hoverTimeout)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Qtip id={item.id} />
                </div>
              )}

            <div className="flex flex-col justify-center min-w-0">
              <Link
                to={`/${item.id}`}
                className="text-gray-200 hover:text-white line-clamp-1 text-sm"
              >
                {language === "EN" ? item.title : item.japanese_title}
              </Link>

              <div className="flex gap-3 mt-1 text-xs text-gray-400">
                {item.tvInfo?.sub && (
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faClosedCaptioning} />
                    {item.tvInfo.sub}
                  </span>
                )}
                {item.tvInfo?.dub && (
                  <span className="flex items-center gap-1">
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
