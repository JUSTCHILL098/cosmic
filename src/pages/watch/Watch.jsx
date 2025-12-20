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
import SharePopup from "@/src/components/share/SharePopup";
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

export default function Watch() {
  const [showSharePopup, setShowSharePopup] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { id: animeId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  let initialEpisodeId = queryParams.get("ep");
  const roomParam = queryParams.get("room");
  
  const { 
    isInRoom, 
    isHost, 
    roomCode: currentRoomCode,
    joinRoom,
    nickname
  } = useMultiplayer();

  const [tags, setTags] = useState([]);
  const { language } = useLanguage();
  const isFirstSet = useRef(true);
  const [showNextEpisodeSchedule, setShowNextEpisodeSchedule] = useState(true);

  const {
    buffering,
    streamInfo,
    streamUrl,
    animeInfo,
    episodes,
    nextEpisodeSchedule,
    intro,
    outro,
    subtitles,
    thumbnail,
    setIsFullOverview,
    isFullOverview,
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
    totalEpisodes
  } = useWatch(animeId, initialEpisodeId);

  const {
    autoPlay,
    setAutoPlay,
    autoSkipIntro,
    setAutoSkipIntro,
    autoNext,
    setAutoNext,
  } = useWatchControl();

  const playerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const controlsRef = useRef(null);
  const episodesRef = useRef(null);

  // Auto-join room logic
  useEffect(() => {
    if (roomParam && !isInRoom && nickname && !currentRoomCode) {
      joinRoom(roomParam, nickname);
    }
  }, [roomParam, isInRoom, nickname, currentRoomCode, joinRoom]);

  // Handle URL updates
  useEffect(() => {
    if (!episodes || episodes.length === 0) return;
    const newUrl = `/watch/${animeId}?ep=${episodeId}${currentRoomCode ? `&room=${currentRoomCode}` : ''}`;
    if (isFirstSet.current) {
      navigate(newUrl, { replace: true });
      isFirstSet.current = false;
    } else {
      navigate(newUrl);
    }
  }, [episodeId, animeId, navigate, episodes, currentRoomCode]);

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a]">
      <div className="w-full max-w-[1920px] mx-auto pt-16 pb-6 w-full max-[1200px]:pt-12">
        <div className="grid grid-cols-[minmax(0,70%),minmax(0,30%)] gap-6 w-full h-full max-[1200px]:flex max-[1200px]:flex-col">
          
          <div className="flex flex-col w-full gap-6">
            <RoomStatus />
            
            <div ref={playerRef} className="player w-full h-fit bg-black flex flex-col rounded-xl overflow-hidden">
              <div ref={videoContainerRef} className="w-full relative aspect-video bg-black">
                {(() => {
                  // !!! CRITICAL FIX: If in a room, force shouldUseIframe to FALSE !!!
                  const isIframeServer = ["hd-1", "hd-4", "nest"].includes(activeServerName?.toLowerCase()) || 
                                       activeServerType?.toLowerCase() === "slay" || 
                                       activeServerName?.includes("VidAPI") || 
                                       activeServerName?.toLowerCase() === "pahe";
                  
                  const shouldUseIframe = !isInRoom && isIframeServer;

                  if (buffering) return (
                    <div className="absolute inset-0 flex justify-center items-center bg-black">
                      <BouncingLoader />
                    </div>
                  );

                  return shouldUseIframe ? (
                    <IframePlayer
                      episodeId={episodeId}
                      servertype={activeServerType}
                      serverName={activeServerName}
                      animeInfo={animeInfo}
                      episodeNum={activeEpisodeNum}
                      episodes={episodes}
                      playNext={(id) => setEpisodeId(id)}
                      autoNext={autoNext}
                      activeServer={activeServer}
                    />
                  ) : (
                    <Player
                      streamUrl={streamUrl}
                      subtitles={subtitles}
                      intro={intro}
                      outro={outro}
                      serverName={activeServerName?.toLowerCase()}
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
                  );
                })()}
              </div>

              <div className="bg-[#121212]">
                {!buffering && (
                  <div ref={controlsRef}>
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
                  </div>
                )}
                <div className="px-3 py-2">
                  <Servers
                    servers={servers}
                    activeEpisodeNum={activeEpisodeNum}
                    activeServerId={activeServerId}
                    setActiveServerId={setActiveServerId}
                    serverLoading={serverLoading}
                    setActiveServerType={setActiveServerType}
                    activeServerType={activeServerType}
                    setActiveServerName={setActiveServerName}
                  />
                </div>
              </div>
            </div>

            {/* Anime Info Section */}
            <div className="bg-[#141414] rounded-lg p-4">
              <div className="flex gap-x-6 max-[600px]:flex-row max-[600px]:gap-4">
                {animeInfo?.poster && (
                  <img src={animeInfo.poster} alt="" className="w-[120px] h-[180px] object-cover rounded-md" />
                )}
                <div className="flex flex-col gap-y-4 flex-1">
                  <h1 className="text-[28px] font-medium text-white leading-tight">
                    {language ? animeInfo?.title : animeInfo?.japanese_title}
                  </h1>
                  <p className="text-[15px] text-gray-400">
                    {isFullOverview ? animeInfo?.animeInfo?.Overview : `${animeInfo?.animeInfo?.Overview?.slice(0, 270)}...`}
                    <button className="ml-2 text-white" onClick={() => setIsFullOverview(!isFullOverview)}>
                      {isFullOverview ? "Less" : "More"}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 h-full max-[1200px]:hidden">
            <div ref={episodesRef} className="episodes flex-shrink-0 bg-[#141414] rounded-lg overflow-hidden">
              <Episodelist
                episodes={episodes}
                currentEpisode={episodeId}
                onEpisodeClick={(id) => setEpisodeId(id)}
                totalEpisodes={totalEpisodes}
                isInRoom={isInRoom}
                isHost={isHost}
              />
            </div>
          </div>
        </div>
      </div>
      <MultiplayerPanel />
    </div>
  );
}
