import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { Play } from "lucide-react";
import { FaChevronRight } from "react-icons/fa";
import "./CategoryCard.css";
import { useLanguage } from "@/src/context/LanguageContext";
import { Link, useNavigate } from "react-router-dom";

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

    // SAFE ARRAY
    const safeData = Array.isArray(data) ? data : [];
    const limitedData = limit ? safeData.slice(0, limit) : safeData;

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

      const newItems = getItemsToRender();

      setItemsToRender((prev) => {
        if (
          JSON.stringify(prev.firstRow) !== JSON.stringify(newItems.firstRow) ||
          JSON.stringify(prev.remainingItems) !==
            JSON.stringify(newItems.remainingItems)
        ) {
          return newItems;
        }
        return prev;
      });

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [getItemsToRender]);

    return (
      <div className={`w-full ${className}`}>
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
            {itemsToRender.firstRow.map((item) => (
              <div
                key={item.id}
                className="flex flex-col category-card-container"
              >
                <div className="w-full pb-[140%] relative overflow-hidden rounded-lg shadow-lg group">
                  <div
                    className="absolute inset-0 cursor-pointer"
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
                      className="w-full h-full object-cover"
                    />

                    {/* PLAY OVERLAY */}

                  <div className="h-9 w-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <Play className="h-4 w-4 text-white fill-white ml-[1px]" />
                   </div>
                    </div>
                  </div>

                  {(item.tvInfo?.rating === "18+" ||
                    item?.adultContent === true) && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-0.5 rounded text-[12px] font-bold">
                      18+
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
            ))}
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
              <div className="w-full pb-[140%] relative overflow-hidden rounded-lg shadow-lg group">
                <div
                  className="absolute inset-0 cursor-pointer"
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
                    className="w-full h-full object-cover"
                  />

                  {/* PLAY OVERLAY */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="h-14 w-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <Play className="h-6 w-6 text-white fill-white ml-[2px]" />
                    </div>
                  </div>
                </div>
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
