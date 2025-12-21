import BouncingLoader from "../ui/bouncingloader/Bouncingloader";
import getQtip from "@/src/utils/getQtip.utils";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";

function Qtip({ id }) {
  const [qtip, setQtip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQtipInfo = async () => {
      setLoading(true);
      try {
        const data = await getQtip(id);
        setQtip(data);
      } catch (err) {
        console.error("Error fetching anime info:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQtipInfo();
  }, [id]);

  return (
    <div className="w-[320px] rounded-xl overflow-hidden bg-[#3e3c50]/70 backdrop-blur-xl shadow-2xl z-50">
      {loading || error || !qtip ? (
        <div className="p-6 flex justify-center items-center">
          <BouncingLoader />
        </div>
      ) : (
        <>
          {/* IMAGE HEADER */}
          <div className="w-full h-[160px] relative">
            <img
              src={qtip.poster}
              alt={qtip.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>

          {/* CONTENT */}
          <div className="p-4 flex flex-col gap-y-2">
            <h1 className="text-white font-semibold text-[14px] leading-5">
              {qtip.title}
            </h1>

            {/* RATING + TAGS */}
            <div className="w-full flex items-center relative mt-1">
              {qtip?.rating && (
                <div className="flex gap-x-2 items-center">
                  <FontAwesomeIcon
                    icon={faStar}
                    className="text-[#ffc107]"
                  />
                  <p className="text-[#e5e5e5] text-[13px]">
                    {qtip.rating}
                  </p>
                </div>
              )}

              <div className="flex ml-4 gap-x-[2px] overflow-hidden rounded-md items-center">
                {/* QUALITY */}
                {qtip?.quality && (
                  <div className="bg-white/70 backdrop-blur-md px-2 py-[1px] rounded text-black">
                    <p className="text-[12px] font-semibold">
                      {qtip.quality}
                    </p>
                  </div>
                )}

                {/* SUB / DUB / EPS */}
                <div className="flex gap-x-[2px]">
                  {qtip?.subCount && (
                    <div className="flex gap-x-1 items-center bg-white/60 backdrop-blur-md px-2 py-[1px] rounded text-black">
                      <FontAwesomeIcon
                        icon={faClosedCaptioning}
                        className="text-[12px]"
                      />
                      <p className="text-[12px] font-semibold">
                        {qtip.subCount}
                      </p>
                    </div>
                  )}

                  {qtip?.dubCount && (
                    <div className="flex gap-x-1 items-center bg-white/60 backdrop-blur-md px-2 py-[1px] rounded text-black">
                      <FontAwesomeIcon
                        icon={faMicrophone}
                        className="text-[12px]"
                      />
                      <p className="text-[12px] font-semibold">
                        {qtip.dubCount}
                      </p>
                    </div>
                  )}

                  {qtip?.episodeCount && (
                    <div className="flex items-center bg-white/60 backdrop-blur-md px-2 py-[1px] rounded text-black">
                      <p className="text-[12px] font-semibold">
                        {qtip.episodeCount}
                      </p>
                    </div>
                  )}
                </div>

                {/* TYPE (TV / MOVIE / SPECIAL) */}
                {qtip?.type && (
                  <div className="absolute right-0 top-0 bg-white/70 backdrop-blur-md px-2 py-[1px] rounded text-black">
                    <p className="text-[12px] font-semibold">
                      {qtip.type}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}
            {qtip?.description && (
              <p className="text-[#d7d7d8] text-[13px] leading-4 line-clamp-3 mt-1">
                {qtip.description}
              </p>
            )}

            {/* META */}
            <div className="flex flex-col gap-y-[2px] mt-1">
              {qtip?.japaneseTitle && (
                <p className="text-[12px] text-[#b7b7b8]">
                  Japanese:{" "}
                  <span className="text-white">
                    {qtip.japaneseTitle}
                  </span>
                </p>
              )}
              {qtip?.status && (
                <p className="text-[12px] text-[#b7b7b8]">
                  Status:{" "}
                  <span className="text-white">{qtip.status}</span>
                </p>
              )}
            </div>

            {/* WATCH BUTTON (EXACT STYLE YOU REQUESTED) */}
            <Link to={qtip.watchLink} className="mt-4">
              <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 rounded-md px-8 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 w-full">
                <Play className="h-4 w-4 fill-current" />
                Watch Now
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Qtip;
