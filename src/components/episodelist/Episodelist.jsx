import { useLanguage } from "@/src/context/LanguageContext";
import {
  faAngleDown,
  faCirclePlay,
  faList,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
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
      const containerTop = container.getBoundingClientRect().top;
      const containerHeight = container.clientHeight;
      const activeEpisodeTop = activeEpisode.getBoundingClientRect().top;
      const activeEpisodeHeight = activeEpisode.clientHeight;
      const offset = activeEpisodeTop - containerTop;
      container.scrollTop =
        container.scrollTop +
        offset -
        containerHeight / 2 +
        activeEpisodeHeight / 2;
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleChange(e) {
    const value = e.target.value;
    if (value.trim() === "") {
      const newRange = findRangeForEpisode(1);
      setSelectedRange(newRange);
      setActiveRange(`${newRange[0]}-${newRange[1]}`);
      setSearchedEpisode(null);
    } else if (!value || isNaN(value)) {
      setSearchedEpisode(null);
    } else if (
      !isNaN(value) &&
      parseInt(value, 10) > totalEpisodes &&
      episodeNum !== null
    ) {
      const newRange = findRangeForEpisode(episodeNum);
      setSelectedRange(newRange);
      setActiveRange(`${newRange[0]}-${newRange[1]}`);
      setSearchedEpisode(null);
    } else if (!isNaN(value) && value.trim() !== "") {
      const num = parseInt(value, 10);
      const foundEpisode = episodes.find((item) => item?.episode_no === num);
      if (foundEpisode) {
        const newRange = findRangeForEpisode(num);
        setSelectedRange(newRange);
        setActiveRange(`${newRange[0]}-${newRange[1]}`);
        setSearchedEpisode(foundEpisode?.id);
      }
    } else {
      setSearchedEpisode(null);
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
      const start = i + 1;
      const end = Math.min(i + step, totalEpisodes);
      ranges.push(`${start}-${end}`);
    }
    return ranges;
  }
  useEffect(() => {
    if (currentEpisode && episodeNum) {
      if (episodeNum < selectedRange[0] || episodeNum > selectedRange[1]) {
        const newRange = findRangeForEpisode(episodeNum);
        setSelectedRange(newRange);
        setActiveRange(`${newRange[0]}-${newRange[1]}`);
      }
    }
  }, [currentEpisode, totalEpisodes, episodeNum]);

  const handleRangeSelect = (range) => {
    const [start, end] = range.split("-").map(Number);
    setSelectedRange([start, end]);
  };

  useEffect(() => {
    const activeEpisode = episodes.find(
      (item) => item?.id.match(/ep=(\d+)/)?.[1] === activeEpisodeId
    );
    if (activeEpisode) {
      setEpisodeNum(activeEpisode?.episode_no);
    }
  }, [activeEpisodeId, episodes]);

  return (
    <div className="flex flex-col w-full h-full bg-black">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-2 bg-black border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-white font-mono uppercase tracking-wider">Episodes</span>
          {totalEpisodes > 100 && (
            <div className="relative" ref={dropDownRef}>
              <button
                onClick={() => setShowDropDown(p => !p)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.05] border border-white/[0.07] text-white/50 hover:text-white text-[11px] font-mono transition-colors"
              >
                <FontAwesomeIcon icon={faList} className="text-[10px]" />
                {selectedRange[0]}–{selectedRange[1]}
                <FontAwesomeIcon icon={faAngleDown} className="text-[9px]" />
              </button>
              {showDropDown && (
                <div className="absolute top-full mt-1 left-0 z-30 bg-black border border-white/10 w-[130px] max-h-[200px] overflow-y-auto rounded-lg shadow-2xl">
                  {generateRangeOptions(totalEpisodes).map((item, index) => (
                    <button key={index} onClick={() => { handleRangeSelect(item); setActiveRange(item); setShowDropDown(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-[11px] font-mono transition-colors ${item === activeRange ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/[0.05] hover:text-white"}`}>
                      {item}
                      {item === activeRange && <FontAwesomeIcon icon={faCheck} className="text-white text-[9px]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {totalEpisodes > 100 && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/[0.04] border border-white/[0.07] rounded-md focus-within:border-white/20 transition-colors">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[10px] text-white/30" />
            <input type="text" placeholder="Jump to..." onChange={handleChange}
              className="w-[80px] bg-transparent text-[11px] text-white placeholder:text-white/25 font-mono outline-none" />
          </div>
        )}
      </div>

      {/* Episode list */}
      <div ref={listContainerRef} className="flex-1 overflow-y-auto scrollbar-hide" style={{ maxHeight: "calc(100% - 40px)" }}>
        {totalEpisodes > 30 ? (
          <div className="p-3 grid gap-1.5"
            style={{ gridTemplateColumns: totalEpisodes > 100 ? "repeat(5,1fr)" : "repeat(5,1fr)" }}>
            {episodes.slice(selectedRange[0] - 1, selectedRange[1]).map((item, index) => {
              const epNum = item?.id.match(/ep=(\d+)/)?.[1];
              const isActive = activeEpisodeId === epNum || currentEpisode === epNum;
              const isSearched = searchedEpisode === item?.id;
              return (
                <button key={item?.id} ref={isActive ? activeEpisodeRef : null}
                  onClick={() => { if (epNum) { onEpisodeClick(epNum); setActiveEpisodeId(epNum); setSearchedEpisode(null); } }}
                  className={`h-9 rounded-md text-xs font-mono font-medium transition-all ${
                    isActive ? "bg-white text-black" : item?.filler ? "bg-yellow-500/10 text-yellow-400/70 hover:bg-yellow-500/20" : "bg-white/[0.05] text-white/50 hover:bg-white/10 hover:text-white"
                  } ${isSearched ? "ring-1 ring-white" : ""}`}>
                  {index + selectedRange[0]}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col">
            {episodes?.map((item, index) => {
              const epNum = item?.id.match(/ep=(\d+)/)?.[1];
              const isActive = activeEpisodeId === epNum || currentEpisode === epNum;
              const isSearched = searchedEpisode === item?.id;
              return (
                <button key={item?.id} ref={isActive ? activeEpisodeRef : null}
                  onClick={() => { if (epNum) { onEpisodeClick(epNum); setActiveEpisodeId(epNum); setSearchedEpisode(null); } }}
                  className={`w-full px-3 py-2.5 flex items-center gap-3 text-left transition-all border-b border-white/[0.04] last:border-0 ${
                    isActive ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
                  } ${isSearched ? "ring-inset ring-1 ring-white/30" : ""}`}>
                  <span className={`text-xs font-mono w-6 flex-shrink-0 ${isActive ? "text-white font-bold" : "text-white/30"}`}>
                    {index + 1}
                  </span>
                  <span className={`text-xs font-mono truncate flex-1 ${isActive ? "text-white font-semibold" : "text-white/60"}`}>
                    {language === "EN" ? item?.title : item?.japanese_title}
                  </span>
                  {isActive && <FontAwesomeIcon icon={faCirclePlay} className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Episodelist;
