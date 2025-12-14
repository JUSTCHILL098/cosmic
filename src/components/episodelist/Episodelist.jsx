import { useLanguage } from "@/src/context/LanguageContext";
import {
  faAngleDown,
  faCirclePlay,
  faList,
  faCheck,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import "./Episodelist.css";

function Episodelist({
  episodes,
  onEpisodeClick,
  currentEpisode,
  totalEpisodes,
}) {
  const { language } = useLanguage();

  const [activeEpisodeId, setActiveEpisodeId] = useState(currentEpisode);
  const [episodeNum, setEpisodeNum] = useState(currentEpisode);
  const [showDropDown, setShowDropDown] = useState(false);
  const [selectedRange, setSelectedRange] = useState([1, 100]);
  const [activeRange, setActiveRange] = useState("1-100");
  const [searchedEpisode, setSearchedEpisode] = useState(null);

  const listContainerRef = useRef(null);
  const activeEpisodeRef = useRef(null);
  const dropDownRef = useRef(null);

  /* ===========================
     SCROLL TO ACTIVE EP
  =========================== */
  useEffect(() => {
    if (activeEpisodeRef.current && listContainerRef.current) {
      const container = listContainerRef.current;
      const active = activeEpisodeRef.current;
      container.scrollTop =
        active.offsetTop -
        container.clientHeight / 2 +
        active.clientHeight / 2;
    }
  }, [activeEpisodeId]);

  useEffect(() => {
    setActiveEpisodeId(episodeNum);
  }, [episodeNum]);

  /* ===========================
     CLOSE DROPDOWN ON OUTSIDE CLICK
  =========================== */
  useEffect(() => {
    const handler = (e) => {
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
        setShowDropDown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ===========================
     RANGE HELPERS
  =========================== */
  const findRangeForEpisode = (ep) => {
    const step = 100;
    const start = Math.floor((ep - 1) / step) * step + 1;
    const end = Math.min(start + step - 1, totalEpisodes);
    return [start, end];
  };

  const generateRangeOptions = () => {
    const ranges = [];
    for (let i = 0; i < totalEpisodes; i += 100) {
      ranges.push(`${i + 1}-${Math.min(i + 100, totalEpisodes)}`);
    }
    return ranges;
  };

  /* ===========================
     SEARCH
  =========================== */
  function handleChange(e) {
    const value = e.target.value;
    if (!value || isNaN(value)) {
      setSearchedEpisode(null);
      return;
    }

    const num = parseInt(value, 10);
    const found = episodes.find((ep) => ep?.episode_no === num);

    if (found) {
      const newRange = findRangeForEpisode(num);
      setSelectedRange(newRange);
      setActiveRange(`${newRange[0]}-${newRange[1]}`);
      setSearchedEpisode(found.id);
    }
  }

  return (
    <div className="flex flex-col w-full h-full bg-black">
      {/* HEADER */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2.5
                      bg-black border-b border-zinc-800">

        <div className="flex items-center gap-4">
          <h1 className="text-[14px] font-semibold text-white">Episodes</h1>

          {totalEpisodes > 100 && (
            <div
              ref={dropDownRef}
              onClick={() => setShowDropDown((p) => !p)}
              className="relative flex items-center gap-2 px-3 py-1.5
                         bg-black border border-zinc-700 rounded-md
                         text-white cursor-pointer hover:border-zinc-500
                         transition"
            >
              <FontAwesomeIcon icon={faList} />
              <p className="text-[12px]">
                {selectedRange[0]}-{selectedRange[1]}
              </p>
              <FontAwesomeIcon icon={faAngleDown} className="text-[10px]" />

              {showDropDown && (
                <div className="absolute top-full mt-2 left-0 z-30
                                bg-black w-[150px] max-h-[200px]
                                overflow-y-auto rounded-lg
                                border border-zinc-700 shadow-lg">
                  {generateRangeOptions().map((item) => (
                    <div
                      key={item}
                      onClick={() => {
                        const [s, e] = item.split("-").map(Number);
                        setSelectedRange([s, e]);
                        setActiveRange(item);
                        setShowDropDown(false);
                      }}
                      className={`px-3 py-2 text-[12px]
                                  cursor-pointer flex justify-between items-center
                                  ${item === activeRange
                                    ? "bg-zinc-900 text-white"
                                    : "text-white hover:bg-zinc-900"}`}
                    >
                      {item}
                      {item === activeRange && (
                        <FontAwesomeIcon icon={faCheck} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {totalEpisodes > 100 && (
          <div className="min-w-[180px]">
            <div className="flex items-center gap-2 px-3 py-1.5
                            bg-black border border-zinc-700 rounded-lg
                            focus-within:border-zinc-500 transition">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-[12px] text-zinc-400"
              />
              <input
                type="text"
                className="w-full bg-transparent focus:outline-none
                           text-[13px] text-white placeholder:text-zinc-500"
                placeholder="Go to episode..."
                onChange={handleChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* EPISODES GRID */}
      <div
        ref={listContainerRef}
        className="flex-1 overflow-y-auto bg-black max-h-[calc(100vh-200px)]"
      >
        <div className="p-4 grid grid-cols-5 gap-2">
          {episodes
            .slice(selectedRange[0] - 1, selectedRange[1])
            .map((item, index) => {
              const episodeNumber = item?.id.match(/ep=(\d+)/)?.[1];
              const isActive =
                activeEpisodeId === episodeNumber ||
                currentEpisode === episodeNumber;
              const isSearched = searchedEpisode === item?.id;
              const isFiller = item?.filler;

              return (
                <div
                  key={item?.id}
                  ref={isActive ? activeEpisodeRef : null}
                  onClick={() => {
                    if (episodeNumber) {
                      onEpisodeClick(episodeNumber);
                      setActiveEpisodeId(episodeNumber);
                      setSearchedEpisode(null);
                    }
                  }}
                  className={`h-[35px] flex items-center justify-center rounded-lg
                              text-[13px] font-medium cursor-pointer transition
                              border border-zinc-800
                              ${
                                isActive
                                  ? "bg-white text-black ring-1 ring-white"
                                  : isFiller
                                  ? "bg-black text-zinc-300"
                                  : "bg-black text-white"
                              }
                              hover:bg-zinc-900 hover:text-white
                              ${isSearched ? "ring-2 ring-white" : ""}`}
                >
                  {index + selectedRange[0]}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Episodelist;
