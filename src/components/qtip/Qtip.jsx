import BouncingLoader from "../ui/bouncingloader/Bouncingloader";
import getQtip from "@/src/utils/getQtip.utils";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { Play, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

/* SAME TAG LOGIC STYLE AS BANNER */
const TAGS = [
  { label: "Classic", cls: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
  { label: "Trending", cls: "bg-red-500/15 text-red-600 border-red-500/30" },
  { label: "New Season", cls: "bg-green-500/15 text-green-600 border-green-500/30" },
  { label: "Fantasy", cls: "bg-purple-500/15 text-purple-600 border-purple-500/30" },
  { label: "Popular", cls: "bg-orange-500/15 text-orange-600 border-orange-500/30" },
];

const pickTag = (seed) => TAGS[seed % TAGS.length];

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

  const tag = pickTag(Number(id) || 0);

  return (
    <div className="w-[320px] rounded-xl overflow-hidden bg-[#3e3c50]/70 backdrop-blur-xl shadow-2xl z-50">
      {loading || error || !qtip ? (
        <div className="p-6 flex justify-center items-center">
          <BouncingLoader />
        </div>
      ) : (
        <>
          {/* SMALL IMAGE (BANNER STYLE, NOT BIG) */}
          <div className="relative h-[90px] w-full">
            <img
              src={qtip.poster}
              alt={qtip.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* TAG */}
            <div
              className={`
                absolute top-2 left-2
                inline-flex items-center rounded-md px-2 py-[2px]
                text-xs font-semibold border backdrop-blur-sm
                ${tag.cls}
              `}
            >
              {tag.label}
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-4 flex flex-col gap-y-2">
            {/* TITLE */}
            <h1 className="text-white font-semibold text-[14px] leading-5">
              {qtip.title}
            </h1>

            {/* META ROW */}
            <div className="flex items-center gap-3 text-sm text-white/80">
              {qtip?.rating && (
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon
                    icon={faStar}
                    className="text-yellow-400"
                  />
                  <span>{qtip.rating}</span>
                </div>
              )}

              {qtip?.airedDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{qtip.airedDate}</span>
                </div>
              )}
            </div>

            {/* TRANSLUCENT PILLS */}
            <div className="flex flex-wrap gap-1 mt-1">
              {qtip?.quality && (
                <div className="px-2 py-[2px] rounded bg-white/40 backdrop-blur-md text-black text-xs font-semibold">
                  {qtip.quality}
                </div>
              )}

              {qtip?.subCount && (
                <div className="flex items-center gap-1 px-2 py-[2px] rounded bg-white/35 backdrop-blur-md text-black text-xs font-semibold">
                  <FontAwesomeIcon icon={faClosedCaptioning} />
                  {qtip.subCount}
                </div>
              )}

              {qtip?.dubCount && (
                <div className="flex items-center gap-1 px-2 py-[2px] rounded bg-white/35 backdrop-blur-md text-black text-xs font-semibold">
                  <FontAwesomeIcon icon={faMicrophone} />
                  {qtip.dubCount}
                </div>
              )}

              {qtip?.episodeCount && (
                <div className="px-2 py-[2px] rounded bg-white/35 backdrop-blur-md text-black text-xs font-semibold">
                  {qtip.episodeCount} eps
                </div>
              )}

              {qtip?.type && (
                <div className="px-2 py-[2px] rounded bg-white/45 backdrop-blur-md text-black text-xs font-semibold">
                  {qtip.type}
                </div>
              )}
            </div>

            {/* DESCRIPTION */}
            {qtip?.description && (
              <p className="text-white/70 text-[13px] leading-4 line-clamp-3 mt-1">
                {qtip.description}
              </p>
            )}

            {/* WATCH BUTTON (WHITE + GLOW, EXACT INTENT) */}
            <Link to={qtip.watchLink} className="mt-4">
              <button
                className="
                  inline-flex items-center justify-center gap-2
                  h-10 w-full px-8 rounded-md
                  bg-white text-black
                  text-sm font-medium
                  shadow-lg shadow-white/30
                  hover:bg-gray-200 transition
                  focus-visible:outline-none focus-visible:ring-1
                "
              >
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
