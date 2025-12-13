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

function Topten({ data, className }) {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [activePeriod, setActivePeriod] = useState("today");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  // 🛡 HARD GUARD — DO NOT REMOVE
  const safeData = useMemo(() => {
    if (!data) return { today: [], week: [], month: [] };
    return {
      today: Array.isArray(data.today) ? data.today : [],
      week: Array.isArray(data.week) ? data.week : [],
      month: Array.isArray(data.month) ? data.month : [],
    };
  }, [data]);

  const currentData = safeData[activePeriod];

  // 🛡 NEVER call hook with undefined
  const {
    tooltipPosition,
    tooltipHorizontalPosition,
    cardRefs,
  } = useToolTipPosition(hoveredItem, currentData);

  if (!currentData.length) return null;

  const handleMouseEnter = (item, index) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoveredItem(`${item.id}-${index}`);
  };

  const handleMouseLeave = () => {
    setHoverTimeout(
      setTimeout(() => {
        setHoveredItem(null);
      }, 250)
    );
  };

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
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

      <div className="flex flex-col space-y-3 bg-[#1a1a1a] p-4 rounded-lg">
        {currentData.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => (cardRefs.current[index] = el)}
            className="flex items-center gap-3 relative"
          >
            <span className="text-gray-500 font-bold w-6">
              {String(index + 1).padStart(2, "0")}
            </span>

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
                  onMouseEnter={() => hoverTimeout && clearTimeout(hoverTimeout)}
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
