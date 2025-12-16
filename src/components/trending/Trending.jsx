import { useLanguage } from "@/src/context/LanguageContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
  faFire,
} from "@fortawesome/free-solid-svg-icons";

const Trending = ({ trending, className }) => {
  const { language } = useLanguage();

  return (
    <div className={`bg-black rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <FontAwesomeIcon icon={faFire} className="text-white" />
        <h2 className="text-xl font-semibold text-white">
          Trending Now
        </h2>
      </div>

      <div
        className="
          flex flex-col space-y-2
          max-h-[600px] overflow-y-auto pr-2
          scrollbar-thin
          scrollbar-track-black
          scrollbar-thumb-white/20
          hover:scrollbar-thumb-white/30
          scrollbar-thumb-rounded
        "
      >
        {trending &&
          trending.map((item, index) => (
            <div key={index} className="group">
              <Link
                to={`/${item.id}`}
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
                className="block"
              >
                <div
                  className="
                    flex items-start gap-3 p-2 rounded-lg
                    transition-colors
                    hover:bg-white/5
                  "
                >
                  <div className="relative">
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="w-[50px] h-[70px] rounded object-cover"
                    />
                    <div className="absolute top-0 left-0 bg-white text-black text-xs font-bold px-1.5 rounded-br">
                      #{index + 1}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors line-clamp-2">
                      {language === "EN"
                        ? item.title
                        : item.japanese_title}
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      {item.tvInfo?.sub && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/10 rounded text-white/80">
                          <FontAwesomeIcon
                            icon={faClosedCaptioning}
                            className="text-[10px]"
                          />
                          <span className="text-[10px] font-medium">
                            {item.tvInfo.sub}
                          </span>
                        </div>
                      )}

                      {item.tvInfo?.dub && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/10 rounded text-white/80">
                          <FontAwesomeIcon
                            icon={faMicrophone}
                            className="text-[10px]"
                          />
                          <span className="text-[10px] font-medium">
                            {item.tvInfo.dub}
                          </span>
                        </div>
                      )}

                      {item.tvInfo?.showType && (
                        <span className="text-xs text-white/50">
                          {item.tvInfo.showType}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Trending;
