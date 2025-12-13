import React, { useState } from "react";
import { useLanguage } from "@/src/context/LanguageContext";
import { useNavigate } from "react-router-dom";

function Topten({ data, className }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [active, setActive] = useState("today");

  const safe = {
    today: Array.isArray(data?.today) ? data.today : [],
    week: Array.isArray(data?.week) ? data.week : [],
    month: Array.isArray(data?.month) ? data.month : [],
  };

  const list = safe[active];

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-white text-2xl font-bold">Top 10</h2>

        <div className="flex bg-[#1a1a1a] rounded-lg overflow-hidden">
          {["today", "week", "month"].map((p) => (
            <button
              key={p}
              onClick={() => setActive(p)}
              className={`px-4 py-1.5 text-sm ${
                active === p
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {p[0].toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-lg p-4 space-y-3">
        {list.length === 0 && (
          <p className="text-gray-400 text-sm">No data available</p>
        )}

        {list.map((item, i) => (
          <div
            key={item.id}
            className="flex gap-3 items-center cursor-pointer"
            onClick={() => navigate(`/watch/${item.id}`)}
          >
            <span className="text-gray-500 font-bold">
              {String(i + 1).padStart(2, "0")}
            </span>

            <img
              src={item.poster}
              alt={item.title}
              className="w-[55px] h-[70px] rounded-lg object-cover"
            />

            <div className="text-white text-sm line-clamp-1">
              {language === "EN" ? item.title : item.japanese_title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Topten;
