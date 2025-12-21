import React, { useCallback, useEffect, useState } from "react";
import { Play } from "lucide-react";
import { FaChevronRight } from "react-icons/fa";
import "./CategoryCard.css";
import { useLanguage } from "@/src/context/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import Qtip from "@/src/components/qtip/Qtip";

const CategoryCard = React.memo(
  ({
    label,
    data = [],
    showViewMore = true,
    className,
    categoryPage = false,
    cardStyle,
    path,
    limit,
  }) => {
    const { language } = useLanguage();
    const navigate = useNavigate();

    const safeData = Array.isArray(data) ? data : [];
    const limitedData = limit ? safeData.slice(0, limit) : safeData;

    const [hoveredId, setHoveredId] = useState(null);

    const [itemsToRender, setItemsToRender] = useState({
      firstRow: [],
      remainingItems: [],
    });

    const getItemsToRender = useCallback(() => {
      if (categoryPage) {
        const firstRow =
          window.innerWidth > 758 && limitedData.length > 4
            ? limitedData.slice(0, 4)
            : [];

        const remainingItems =
          window.innerWidth > 758 && limitedData.length > 4
            ? limitedData.slice(4)
            : limitedData.slice(0);

        return { firstRow, remainingItems };
      }

      return { firstRow: [], remainingItems: limitedData.slice(0) };
    }, [categoryPage, limitedData]);

    useEffect(() => {
      const handleResize = () => {
        setItemsToRender(getItemsToRender());
      };

      setItemsToRender(getItemsToRender());
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [getItemsToRender]);

    return (
      <div className={`w-full ${className}`}>
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-semibold text-2xl text-white max-[478px]:text-[18px] capitalize tracking-wide">
            {label}
          </h1>

          {showViewMore && (
            <Link
              to={`/${path}`}
              className="flex items-center gap-x-1 py-1 px-2 -mr-2 rounded-md
              text-[13px] font-medium text-[#ffffff80] hover:text-white
              transition-all duration-300 group"
            >
              View all
              <FaChevronRight className="text-[10px] transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        {/* CATEGORY PAGE FIRST ROW */}
        {categoryPage && itemsToRender.firstRow.length > 0 && (
          <div className="grid grid-cols-4 gap-x-3 gap-y-8 mt-8 max-[758px]:hidden">
            {itemsToRender.firstRow.map((item) => {
              // 🔥 NORMALIZED ADULT FLAG (same behavior as ContinueWatching)
              const isAdult =
                item?.adultContent === true ||
                ["R", "R+", "Rx", "18"].includes(item?.tvInfo?.rating);

              return (
                <div key={item.id} className="flex flex-col">
                  <div
                    className="w-full pb-[140%] relative overflow-visible rounded-lg shadow-lg group"
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* POSTER */}
                    <div
                      className="absolute inset-0 cursor-pointer z-10"
                      onClick={() =>
                        navigate(
                          path === "top-upcoming"
                            ? `/${item.id}`
                            : `/watch/${item.id}`
                        )
                      }
                    >
                      <img
                        src={item.poster}
                        alt={item.title}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:blur-sm"
                      />

                      {/* PLAY BUTTON */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                          <Play className="h-4 w-4 text-white fill-white ml-[1px]" />
                        </div>
                      </div>
                    </div>

                    {/* QTIP */}
                    {hoveredId === item.id && (
                      <div
                        className="absolute left-full top-1/2 -translate-y-1/2 ml-4 z-50"
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        <Qtip id={item.id} poster={item.poster} />
                      </div>
                    )}

                    {/* 18+ BADGE (NOW MATCHES CONTINUE WATCHING) */}
                    {isAdult && (
                      <div className="absolute top-3 left-3 z-20">
                        <div
                          className="inline-flex items-center rounded-md px-2.5 py-0.5
                                     font-semibold border shadow backdrop-blur-sm
                                     text-xs sm:text-sm
                                     bg-red-500/10 text-red-600 border-red-500/20"
                        >
                          18+
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/${item.id}`}
                    className="text-white font-semibold mt-3 line-clamp-1"
                  >
                    {language === "EN" ? item.title : item.japanese_title}
                  </Link>

                  {item.description && (
                    <div className="line-clamp-3 text-[13px] text-gray-400 mt-3 max-[1200px]:hidden">
                      {item.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* MAIN GRID */}
        <div
          className={`grid ${
            cardStyle ||
            "grid-cols-6 max-[1400px]:grid-cols-4 max-[758px]:grid-cols-3 max-[478px]:grid-cols-3"
          } gap-x-3 gap-y-8 mt-6 max-[478px]:gap-x-2`}
        >
          {itemsToRender.remainingItems.map((item) => (
            <div key={item.id} className="flex flex-col">
              <div
                className="w-full pb-[140%] relative overflow-visible rounded-lg shadow-lg group"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div
                  className="absolute inset-0 cursor-pointer z-10"
                  onClick={() =>
                    navigate(
                      path === "top-upcoming"
                        ? `/${item.id}`
                        : `/watch/${item.id}`
                    )
                  }
                >
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:blur-sm"
                  />

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                      <Play className="h-4 w-4 text-white fill-white ml-[1px]" />
                    </div>
                  </div>
                </div>

                {hoveredId === item.id && (
                  <div
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-4 z-50"
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <Qtip id={item.id} poster={item.poster} />
                  </div>
                )}
              </div>

              <Link
                to={`/${item.id}`}
                className="text-white font-semibold mt-3 line-clamp-1"
              >
                {language === "EN" ? item.title : item.japanese_title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

CategoryCard.displayName = "CategoryCard";
export default CategoryCard;
