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
  const [activeEpisodeId, setActiveEpisodeId] = useState(currentEpisode);
  const { language } = useLanguage();
  const listContainerRef = useRef(null);
  const activeEpisodeRef = useRef(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const [selectedRange, setSelectedRange] = useState([1, 100]);
  const [activeRange, setActiveRange] = useState("1-100");
  const [episodeNum, setEpisodeNum] = useState(currentEpisode);
  const dropDownRef = useRef(null);
  const [searchedEpisode, setSearchedEpisode] = useState(null);

  const scrollToActiveEpisode = () => {
    if (activeEpisodeRef.current && listContainerRef.current) {
      const container = listContainerRef.current;
      const activeEpisode = activeEpisodeRef.current;
      const offset =
        activeEpisode.offsetTop -
        container.clientHeight / 2 +
        activeEpisode.clientHeight / 2;
      container.scrollTop = offset;
    }
  };

  useEffect(() => {
    setActiveEpisodeId(episodeNum);
  }, [episodeNum]);

  useEffect(() => {
    scrollToActiveEpisode();
  }, [activeEpisodeId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setShowDropDown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(e) {
    const value = e.target.value;
    if (!value || isNaN(value)) {
      setSearchedEpisode(null);
      return;
    }
    const num = parseInt(value, 10);
    const foundEpisode = episodes.find((item) => item?.episode_no === num);
    if (foundEpisode) {
      setSearchedEpisode(foundEpisode?.id);
    }
  }

  function findRangeForEpisode(episodeNumber) {
    const step = 100;
    const start = Math.floor((episodeNumber - 1) / step) * step + 1;
    const end = Math.min(start + step - 1, totalEpisodes);
    return [start, end];
  }

  function generateRangeOptions(totalEpisodes) {
    const ranges = [];
    const step = 100;
    for (let i = 0; i < totalEpisodes; i += step) {
      ranges.push(`${i + 1}-${Math.min(i + step, totalEpisodes)}`);
    }
    return ranges;
  }

  useEffect(() => {
    const activeEpisode = episodes.find(
      (item) => item?.id.match(/ep=(\d+)/)?.[1] === activeEpisodeId
    );
    if (activeEpisode) setEpisodeNum(activeEpisode?.episode_no);
  }, [activeEpisodeId, episodes]);

  return (
    <div className="flex flex-col w-full h-full bg-black">
      {/* HEADER */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2.5 bg-black border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <h1 className="text-[14px] font-semibold text-white">Episodes</h1>

          {totalEpisodes > 100 && (
            <div
              ref={dropDownRef}
              onClick={() => setShowDropDown((p) => !p)}
              className="relative flex items-center gap-2 px-3 py-1.5
                         bg-black border border-zinc-700 rounded-md
                         text-white cursor-pointer hover:border-zinc-500 transition"
            >
              <FontAwesomeIcon icon={faList} />
              <p className="text-[12px]">
                {selectedRange[0]}-{selectedRange[1]}
              </p>
              <FontAwesomeIcon icon={faAngleDown} className="text-[10px]" />

              {showDropDown && (
                <div className="absolute top-full mt-2 left-0 z-30 bg-black w-[150px]
                                max-h-[200px] overflow-y-auto rounded-lg
                                border border-zinc-700 shadow-lg">
                  {generateRangeOptions(totalEpisodes).map((item) => (
                    <div
                      key={item}
                      onClick={() => {
                        const [s, e] = item.split("-").map(Number);
                        setSelectedRange([s, e]);
                        setActiveRange(item);
                        setShowDropDown(false);
                      }}
                      className={`px-3 py-2 text-[12px] cursor-pointer
                                  flex justify-between items-center
                                  ${
                                    item === activeRange
                                      ? "bg-zinc-900 text-white"
                                      : "text-white hover:bg-zinc-900"
                                  }`}
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

      {/* EPISODES */}
      <div
        ref={listContainerRef}
        className="w-full flex-1 overflow-y-auto bg-black max-h-[calc(100vh-200px)]"
      >
        <div
          className={`${
            totalEpisodes > 30
              ? "p-4 grid gap-2 grid-cols-5"
              : ""
          }`}
        >
          {totalEpisodes > 30
            ? episodes
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
                      className={`flex items-center justify-center rounded-lg
                                  h-[35px] text-[13px] font-medium
                                  cursor-pointer transition-all
                                  border border-zinc-800
                                  ${
                                    isActive
                                      ? "bg-white text-black ring-1 ring-white"
                                      : isFiller
                                      ? "bg-black text-zinc-300"
                                      : "bg-black text-white"
                                  }
                                  hover:bg-zinc-900
                                  ${isSearched ? "ring-2 ring-white" : ""}`}
                    >
                      {index + selectedRange[0]}
                    </div>
                  );
                })
            : episodes?.map((item, index) => {
                const episodeNumber = item?.id.match(/ep=(\d+)/)?.[1];
                const isActive =
                  activeEpisodeId === episodeNumber ||
                  currentEpisode === episodeNumber;
                const isSearched = searchedEpisode === item?.id;

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
                    className={`w-full px-4 py-2.5 flex items-center gap-x-4
                                cursor-pointer transition bg-black
                                hover:bg-zinc-900
                                ${isActive ? "bg-zinc-900" : ""}
                                ${isSearched ? "ring-1 ring-white" : ""}`}
                  >
                    <p className="text-[14px] font-medium text-white">
                      {index + 1}
                    </p>

                    <div className="w-full flex items-center justify-between">
                      <h1
                        className={`line-clamp-1 text-[14px]
                                    ${
                                      isActive
                                        ? "text-white font-medium"
                                        : "text-zinc-300"
                                    }`}
                      >
                        {language === "EN"
                          ? item?.title
                          : item?.japanese_title}
                      </h1>

                      {isActive && (
                        <FontAwesomeIcon
                          icon={faCirclePlay}
                          className="w-[18px] h-[18px] text-white"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}

export default Episodelist;
