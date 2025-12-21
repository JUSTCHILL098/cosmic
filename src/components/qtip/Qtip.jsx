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
import { Link, useNavigate } from "react-router-dom";

function Qtip({ id, poster }) {
  const [qtip, setQtip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    <div
      className="
        w-[320px]
        rounded-xl
        overflow-hidden
        bg-black
        shadow-2xl
        z-50
        animate-qtip-in
        pointer-events-auto
      "
    >
      {loading || error || !qtip ? (
        <div className="p-6 flex justify-center items-center">
          <BouncingLoader />
        </div>
      ) : (
        <>
          {/* IMAGE — SAME AS BANNER */}
          {poster && (
            <div className="relative w-full h-[90px]">
              <img
                src={poster}
                alt={qtip.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            </div>
          )}

          {/* CONTENT */}
          <div className="p-4 flex flex-col gap-y-2">
            <h1 className="text-white font-semibold text-[14px] leading-5">
              {qtip.title}
            </h1>

            {qtip?.rating && (
              <div className="flex items-center gap-x-1 text-white/80">
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-yellow-400 text-[13px]"
                />
                <span className="text-[13px]">{qtip.rating}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-1 mt-1">
              {qtip?.quality && (
                <div className="px-2 py-[2px] rounded bg-white/20 backdrop-blur-md text-white text-[12px] font-semibold">
                  {qtip.quality}
                </div>
              )}
              {qtip?.subCount && (
                <div className="flex items-center gap-x-1 px-2 py-[2px] rounded bg-white/15 backdrop-blur-md text-white text-[12px] font-semibold">
                  <FontAwesomeIcon icon={faClosedCaptioning} />
                  {qtip.subCount}
                </div>
              )}
              {qtip?.dubCount && (
                <div className="flex items-center gap-x-1 px-2 py-[2px] rounded bg-white/15 backdrop-blur-md text-white text-[12px] font-semibold">
                  <FontAwesomeIcon icon={faMicrophone} />
                  {qtip.dubCount}
                </div>
              )}
              {qtip?.episodeCount && (
                <div className="px-2 py-[2px] rounded bg-white/15 backdrop-blur-md text-white text-[12px] font-semibold">
                  {qtip.episodeCount} eps
                </div>
              )}
              {qtip?.type && (
                <div className="px-2 py-[2px] rounded bg-white/25 backdrop-blur-md text-white text-[12px] font-semibold">
                  {qtip.type}
                </div>
              )}
            </div>

            {qtip?.description && (
              <p className="text-white/70 text-[13px] leading-4 line-clamp-3 mt-1">
                {qtip.description}
              </p>
            )}

            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                navigate(qtip.watchLink);
              }}
              className="
                mt-4
                inline-flex items-center justify-center gap-2
                h-10 w-full px-8 rounded-md
                bg-white text-black
                text-sm font-medium
                shadow-lg shadow-white/40
                hover:bg-gray-200 transition
              "
            >
              <Play className="h-4 w-4 fill-current" />
              Watch Now
            </button>
          </div>
        </>
      )}

      <style>{`
        @keyframes qtipIn {
          from { opacity: 0; transform: scale(0.95) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-qtip-in {
          animation: qtipIn 0.18s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Qtip;
