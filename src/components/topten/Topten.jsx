import React, { useState } from "react";
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

  // ✅ HARD GUARD (NO MORE SILENT FAILURES)
  if (
    !data ||
    !Array.isArray(data.today) ||
    !Array.isArray(data.week) ||
    !Array.isArray(data.month)
  ) {
    return null;
  }

  const currentData = data[activePeriod];

  const { tooltipPosition, tooltipHorizontalPosition, cardRefs } =
    useToolTipPosition(hoveredItem, currentData);

  const handleMouseEnter = (item, index) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoveredItem(item.id + index);
  };

  const handleMouseLeave = () => {
    setHoverTimeout(
      setTimeout(() => {
        setHoveredItem(null);
      }, 300)
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
                  ? "bg-white text-black font-medium"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col bg-[#1a1a1a] rounded-lg p-3 space-y-3">
        {currentData.map((item, index) => {
          const title =
            language === "EN"
              ? item.title || item.name || "Unknown"
              : item.japanese_title || item.name || "Unknown";

          return (
            <div
              key={item.id}
              className="flex items-center gap-x-3"
              ref={(el) => (cardRefs.current[index] = el)}
            >
              <span className="text-white font-bold text-xl w-6">
                {index + 1}
              </span>

              <img
                src={item.poster}
                alt={title}
                className="w-[55px] h-[70px] rounded-md object-cover cursor-pointer"
                onClick={() => navigate(`/watch/${item.id}`)}
                onMouseEnter={() => handleMouseEnter(item, index)}
                onMouseLeave={handleMouseLeave}
              />

              {hoveredItem === item.id + index &&
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

              <div className="flex flex-col">
                <Link
                  to={`/watch/${item.id}`}
                  className="text-gray-200 hover:text-white line-clamp-1"
                >
                  {title}
                </Link>

                <div className="flex gap-x-2 mt-1">
                  {item.tvInfo?.sub && (
                    <span className="text-xs bg-white/10 px-1.5 rounded">
                      <FontAwesomeIcon icon={faClosedCaptioning} />{" "}
                      {item.tvInfo.sub}
                    </span>
                  )}
                  {item.tvInfo?.dub && (
                    <span className="text-xs bg-white/10 px-1.5 rounded">
                      <FontAwesomeIcon icon={faMicrophone} />{" "}
                      {item.tvInfo.dub}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(Topten);
