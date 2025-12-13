import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/src/context/LanguageContext";
import { Link, useNavigate } from "react-router-dom";

function Topten({ data, className }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState("today");

  const safeData = useMemo(() => {
    return {
      today: Array.isArray(data?.today) ? data.today : [],
      week: Array.isArray(data?.week) ? data.week : [],
      month: Array.isArray(data?.month) ? data.month : [],
    };
  }, [data]);

  const currentData = safeData[activePeriod];

  if (!currentData.length) return null;

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl text-white">Top 10</h1>

        <ul className="flex bg-[#1a1a1a] rounded-lg overflow-hidden">
          {["today", "week", "month"].map((period) => (
            <li
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`cursor-pointer px-4 py-1.5 text-sm ${
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
          <div key={item.id} className="flex items-center gap-3">
            <span className="text-gray-500 font-bold w-6">
              {String(index + 1).padStart(2, "0")}
            </span>

            <img
              src={item.poster}
              alt={item.title}
              className="w-[55px] h-[70px] rounded-lg object-cover cursor-pointer"
              onClick={() => navigate(`/watch/${item.id}`)}
            />

            <div className="flex flex-col ml-2">
              <Link
                to={`/${item.id}`}
                className="text-gray-200 hover:text-white line-clamp-1"
              >
                {language === "EN" ? item.title : item.japanese_title}
              </Link>

              <div className="flex gap-2 mt-1 text-xs text-gray-300">
                {item.tvInfo?.sub && (
                  <span>
                    <FontAwesomeIcon icon={faClosedCaptioning} />{" "}
                    {item.tvInfo.sub}
                  </span>
                )}
                {item.tvInfo?.dub && (
                  <span>
                    <FontAwesomeIcon icon={faMicrophone} />{" "}
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
