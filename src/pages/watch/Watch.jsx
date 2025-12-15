//* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/src/context/LanguageContext";
import { useHomeInfo } from "@/src/context/HomeInfoContext";
import { useWatch } from "@/src/hooks/useWatch";
import BouncingLoader from "@/src/components/ui/bouncingloader/Bouncingloader";
import IframePlayer from "@/src/components/player/IframePlayer";
import Episodelist from "@/src/components/episodelist/Episodelist";
import website_name from "@/src/config/website";
import Sidecard from "@/src/components/sidecard/Sidecard";
import {
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Servers from "@/src/components/servers/Servers";
import { Skeleton } from "@/src/components/ui/Skeleton/Skeleton";
import SidecardLoader from "@/src/components/Loader/Sidecard.loader";
import Watchcontrols from "@/src/components/watchcontrols/Watchcontrols";
import useWatchControl from "@/src/hooks/useWatchControl";
import Player from "@/src/components/player/Player";
import MultiplayerPanel from "@/src/components/multiplayer/MultiplayerPanel";
import RoomStatus from "@/src/components/multiplayer/RoomStatus";
import { useMultiplayer } from "@/src/context/MultiplayerContext";
import SharePopup from "@/src/components/SharePopup"; // ✅ ADDED

export default function Watch() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: animeId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  let initialEpisodeId = queryParams.get("ep");
  const roomParam = queryParams.get("room");

  const { language } = useLanguage();
  const { homeInfo } = useHomeInfo();

  const {
    buffering,
    streamInfo,
    streamUrl,
    animeInfo,
    episodes,
    nextEpisodeSchedule,
    animeInfoLoading,
    totalEpisodes,
    isFullOverview,
    intro,
    outro,
    subtitles,
    thumbnail,
    setIsFullOverview,
    activeEpisodeNum,
    seasons,
    episodeId,
    setEpisodeId,
    activeServerId,
    setActiveServerId,
    servers,
    serverLoading,
    activeServerType,
    setActiveServerType,
    activeServerName,
    setActiveServerName,
    activeServer,
  } = useWatch(animeId, initialEpisodeId);

  const {
    autoPlay,
    setAutoPlay,
    autoSkipIntro,
    setAutoSkipIntro,
    autoNext,
    setAutoNext,
  } = useWatchControl();

  const {
    isInRoom,
    isHost,
    roomCode,
    joinRoom,
    nickname,
  } = useMultiplayer();

  const [showSharePopup, setShowSharePopup] = useState(false); // ✅ ADDED
  const [tags, setTags] = useState([]);
  const isFirstSet = useRef(true);

  // ✅ SHARE POPUP (ONCE PER SESSION)
  useEffect(() => {
    const seen = sessionStorage.getItem("share-popup-seen");
    if (!seen) {
      setShowSharePopup(true);
      sessionStorage.setItem("share-popup-seen", "true");
    }
  }, []);

  // Auto-join room
  useEffect(() => {
    if (roomParam && !isInRoom && nickname && !roomCode) {
      joinRoom(roomParam);
    }
  }, [roomParam, isInRoom, nickname, roomCode, joinRoom]);

  // Title
  useEffect(() => {
    if (animeInfo) {
      document.title = `Watch ${animeInfo.title} English Sub/Dub online Free on ${website_name}`;
    }
    return () => {
      document.title = `${website_name} | Free anime streaming platform`;
    };
  }, [animeInfo]);

  // Redirect if no episodes
  useEffect(() => {
    if (totalEpisodes === 0) navigate(`/${animeId}`);
  }, [totalEpisodes, navigate, animeId]);

  // Tags
  useEffect(() => {
    setTags([
      {
        condition: animeInfo?.animeInfo?.tvInfo?.rating,
        text: animeInfo?.animeInfo?.tvInfo?.rating,
      },
      {
        condition: animeInfo?.animeInfo?.tvInfo?.quality,
        text: animeInfo?.animeInfo?.tvInfo?.quality,
      },
      {
        condition: animeInfo?.animeInfo?.tvInfo?.sub,
        icon: faClosedCaptioning,
        text: animeInfo?.animeInfo?.tvInfo?.sub,
      },
      {
        condition: animeInfo?.animeInfo?.tvInfo?.dub,
        icon: faMicrophone,
        text: animeInfo?.animeInfo?.tvInfo?.dub,
      },
    ]);
  }, [animeInfo]);

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] pt-16">

      {/* PLAYER */}
      <RoomStatus />

      <div className="max-w-[1920px] mx-auto px-4">
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
          {!buffering ? (
            <Player
              streamUrl={streamUrl}
              subtitles={subtitles}
              intro={intro}
              outro={outro}
              serverName={activeServerName}
              thumbnail={thumbnail}
              autoSkipIntro={autoSkipIntro}
              autoPlay={autoPlay}
              autoNext={autoNext}
              episodeId={episodeId}
              episodes={episodes}
              playNext={(id) => setEpisodeId(id)}
              animeInfo={animeInfo}
              episodeNum={activeEpisodeNum}
              streamInfo={streamInfo}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BouncingLoader />
            </div>
          )}
        </div>

        {/* CONTROLS */}
        <Watchcontrols
          autoPlay={autoPlay}
          setAutoPlay={setAutoPlay}
          autoSkipIntro={autoSkipIntro}
          setAutoSkipIntro={setAutoSkipIntro}
          autoNext={autoNext}
          setAutoNext={setAutoNext}
          episodes={episodes}
          totalEpisodes={totalEpisodes}
          episodeId={episodeId}
          onButtonClick={(id) => setEpisodeId(id)}
          isInRoom={isInRoom}
          isHost={isHost}
        />

        {/* INFO */}
        <div className="bg-[#141414] rounded-lg p-4 mt-6">
          <Link to={`/${animeId}`}>
            <h1 className="text-white text-2xl font-semibold">
              {language === "EN" ? animeInfo?.title : animeInfo?.japanese_title}
            </h1>
          </Link>

          <div className="flex gap-2 mt-3 flex-wrap">
            {tags.map(
              ({ condition, icon, text }, i) =>
                condition && (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm
                               border border-white/10 text-sm text-gray-300
                               flex items-center gap-1"
                  >
                    {icon && <FontAwesomeIcon icon={icon} />}
                    {text}
                  </span>
                )
            )}
          </div>
        </div>

        {/* EPISODES */}
        <div className="mt-6 bg-[#141414] rounded-lg overflow-hidden">
          {episodes ? (
            <Episodelist
              episodes={episodes}
              currentEpisode={episodeId}
              onEpisodeClick={(id) => setEpisodeId(id)}
              totalEpisodes={totalEpisodes}
            />
          ) : (
            <BouncingLoader />
          )}
        </div>
      </div>

      {/* MULTIPLAYER */}
      <MultiplayerPanel />

      {/* ✅ SHARE POPUP */}
      <SharePopup
        open={showSharePopup}
        onClose={() => setShowSharePopup(false)}
      />
    </div>
  );
}
