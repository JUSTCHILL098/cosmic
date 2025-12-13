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
  episodes = [],
  onEpisodeClick,
  currentEpisode,
  totalEpisodes = 0,
  isInRoom = false,
  isHost = false,
}) {
  const { language } = useLanguage();

  // ✅ ALWAYS SAFE ARRAY
  const safeEpisodes = Array.isArray(episodes) ? episodes : [];

  const [activeEpisodeId, setActiveEpisodeId] = useState(currentEpisode);
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
        container.offsetTop -
        container.clientHeight / 2 +
        activeEpisode.clientHeight / 2;
      container.scrollTop += offset;
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(e) {
    const value = e.target.value;

    if (!value || isNaN(value)) {
      setSearchedEpisode(null);
      return;
    }

    const num = parseInt(value, 10);
    if (num > totalEpisodes || num < 1) {
      setSearchedEpisode(null);
      return;
    }

    const foundEpisode = safeEpisodes.find(
      (item) => item?.episode_no === num
    );

    if (foundEpisode) {
      const newRange = findRangeForEpisode(num);
      setSelectedRange(newRange);
      setActiveRange(`${newRange[0]}-${newRange[1]}`);
      setSearchedEpisode(foundEpisode.id);
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
    if (episodeNum && (episodeNum < selectedRange[0] || episodeNum > selectedRange[1])) {
      const newRange = findRangeForEpisode(episodeNum);
      setSelectedRange(newRange);
      setActiveRange(`${newRange[0]}-${newRange[1]}`);
    }
  }, [episodeNum, selectedRange]);

  useEffect(() => {
    const activeEpisode = safeEpisodes.find(
      (item) => item?.id?.match(/ep=(\d+)/)?.[1] === activeEpisodeId
    );
    if (activeEpisode) setEpisodeNum(activeEpisode.episode_no);
  }, [activeEpisodeId, safeEpisodes]);

  return (
    <div className="flex flex-col w-full h-full">
      <div
        ref={listContainerRef}
        className="w-full flex-1 overflow-y-auto bg-[#1a1a1a]"
      >
        <div className="p-4 grid gap-2 grid-cols-5">
          {safeEpisodes
            .slice(selectedRange[0] - 1, selectedRange[1])
            .map((item, index) => {
              const episodeNumber =
                item?.id?.match(/ep=(\d+)/)?.[1];
              const isActive =
                activeEpisodeId === episodeNumber ||
                currentEpisode === episodeNumber;

              return (
                <div
                  key={item.id}
                  ref={isActive ? activeEpisodeRef : null}
                  className={`flex items-center justify-center rounded-lg h-[35px] text-[13px] ${
                    isActive
                      ? "bg-white text-black"
                      : "bg-[#2a2a2a] text-gray-400 hover:bg-[#404040]"
                  } ${
                    isInRoom && !isHost
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer"
                  }`}
                  onClick={() => {
                    if (!isInRoom || isHost) {
                      onEpisodeClick(episodeNumber);
                      setActiveEpisodeId(episodeNumber);
                    }
                  }}
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
