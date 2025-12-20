/* eslint-disable react/prop-types */
import Hls from "hls.js";
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
  
  // Multiplayer context integration
  const { 
    isInRoom, 
    isHost, 
    roomCode: currentRoomCode,
    syncEpisodeChange,
    joinRoom,
    nickname
  } = useMultiplayer();

  const [tags, setTags] = useState([]);
  const { language } = useLanguage();
  const { homeInfo } = useHomeInfo();
  const isFirstSet = useRef(true);
  const [showNextEpisodeSchedule, setShowNextEpisodeSchedule] = useState(true);

  const {
    buffering,
    streamInfo,
    streamUrl,
    animeInfo,
    episodes,
    nextEpisodeSchedule,
    anilistId,
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
    activeServer
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

  // 1. ORIGINAL LOGIC: Auto-join room if room parameter exists
  useEffect(() => {
    if (roomParam && !isInRoom && nickname && !currentRoomCode) {
      joinRoom(roomParam);
    }
  }, [roomParam, isInRoom, nickname, currentRoomCode, joinRoom]);

  // 2. ORIGINAL LOGIC: Sync episode changes
  useEffect(() => {
    if (isInRoom && isHost && episodeId && animeId) {
      if (syncEpisodeChange) syncEpisodeChange(episodeId, animeId);
    }
  }, [episodeId, animeId, isInRoom, isHost, syncEpisodeChange]);

  // 3. ORIGINAL LOGIC: Validating episodes and updating URL
  useEffect(() => {
    if (!episodes || episodes.length === 0) return;
    const isValidEpisode = episodes.some(ep => ep.id.split('ep=')[1] === episodeId);
    
    if (!episodeId || !isValidEpisode) {
      const fallbackId = episodes[0].id.match(/ep=(\d+)/)?.[1];
      if (fallbackId && fallbackId !== episodeId) setEpisodeId(fallbackId);
      return;
    }
  
    // PERSIST ROOM CODE IN URL
    const newUrl = `/watch/${animeId}?ep=${episodeId}${currentRoomCode ? `&room=${currentRoomCode}` : ''}`;
    if (isFirstSet.current) {
      navigate(newUrl, { replace: true });
      isFirstSet.current = false;
    } else {
      navigate(newUrl);
    }
  }, [episodeId, animeId, navigate, episodes, currentRoomCode]);

  // 4. ORIGINAL LOGIC: Document title
  useEffect(() => {
    if (animeInfo) {
      document.title = `Watch ${animeInfo.title} English Sub/Dub online Free on ${website_name}`;
    }
    return () => {
      document.title = `${website_name} | Free anime streaming platform`;
    };
  }, [animeId, animeInfo]);

  // 5. ORIGINAL LOGIC: Redirect if 0 episodes
  useEffect(() => {
    if (totalEpisodes !== null && totalEpisodes === 0) {
      navigate(`/${animeId}`);
    }
  }, [totalEpisodes, navigate, animeId]);

  // 6. ORIGINAL LOGIC: The complex height adjustment observer
  useEffect(() => {
    const adjustHeight = () => {
      if (window.innerWidth > 1200) {
        if (videoContainerRef.current && controlsRef.current && episodesRef.current) {
          const totalHeight = videoContainerRef.current.offsetHeight + controlsRef.current.offsetHeight;
          episodesRef.current.style.height = `${totalHeight}px`;
        }
      } else if (episodesRef.current) {
        episodesRef.current.style.height = 'auto';
      }
    };

    const initialTimer = setTimeout(adjustHeight, 500);
    window.addEventListener('resize', adjustHeight);
    const observer = new MutationObserver(() => setTimeout(adjustHeight, 100));
    
    if (videoContainerRef.current) observer.observe(videoContainerRef.current, { attributes: true, childList: true, subtree: true });
    if (controlsRef.current) observer.observe(controlsRef.current, { attributes: true, childList: true, subtree: true });
    
    const intervalId = setInterval(adjustHeight, 1000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
      observer.disconnect();
      window.removeEventListener('resize', adjustHeight);
    };
  }, [buffering, activeServerType, activeServerName, episodeId, streamUrl, episodes]);

  // Helper Tag component
  function Tag({ bgColor, index, icon, text }) {
    return (
      <div className={`flex space-x-1 justify-center items-center px-[4px] py-[1px] text-black font-semibold text-[13px] ${index === 0 ? "rounded-l-[4px]" : ""}`} style={{ backgroundColor: bgColor }}>
        {icon && <FontAwesomeIcon icon={icon} className="text-[12px]" />}
        <p className="text-[12px]">{text}</p>
      </div>
    );
  }

  useEffect(() => {
    setTags([
      { condition: animeInfo?.animeInfo?.tvInfo?.rating, bgColor: "#ffffff", text: animeInfo?.animeInfo?.tvInfo?.rating },
      { condition: animeInfo?.animeInfo?.tvInfo?.quality, bgColor: "#FFBADE", text: animeInfo?.animeInfo?.tvInfo?.quality },
      { condition: animeInfo?.animeInfo?.tvInfo?.sub, icon: faClosedCaptioning, bgColor: "#B0E3AF", text: animeInfo?.animeInfo?.tvInfo?.sub },
      { condition: animeInfo?.animeInfo?.tvInfo?.dub, icon: faMicrophone, bgColor: "#B9E7FF", text: animeInfo?.animeInfo?.tvInfo?.dub },
    ]);
  }, [animeInfo]);

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a]">
      <div className="w-full max-w-[1920px] mx-auto pt-16 pb-6 w-full max-[1200px]:pt-12">
        <div className="grid grid-cols-[minmax(0,70%),minmax(0,30%)] gap-6 w-full h-full max-[1200px]:flex max-[1200px]:flex-col">
          
          <div className="flex flex-col w-full gap-6">
            <RoomStatus />
            
            <div ref={playerRef} className="player w-full h-fit bg-black flex flex-col rounded-xl overflow-hidden">
              <div ref={videoContainerRef} className="w-full relative aspect-video bg-black">
                {(() => {
                  // FORCE INTERNAL PLAYER ONLY WHEN IN ROOM
                  const isIframeServer = ["hd-1", "hd-4", "nest"].includes(activeServerName?.toLowerCase()) || activeServerType?.toLowerCase() === "slay" || activeServerName?.includes("VidAPI") || activeServerName?.toLowerCase() === "pahe";
                  const shouldUseIframe = !isInRoom && isIframeServer;

                  return !buffering ? (shouldUseIframe ?
                  <IframePlayer
                    episodeId={episodeId}
                    servertype={activeServerType}
                    serverName={activeServerName}
                    animeInfo={animeInfo}
                    episodeNum={activeEpisodeNum}
                    episodes={episodes}
                    playNext={(id) => setEpisodeId(id)}
                    autoNext={autoNext}
                    aniid={animeInfo?.anilistId}
                    activeServer={activeServer}
                  /> : <Player
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
                ) : (
                  <div className="absolute inset-0 flex justify-center items-center bg-black">
                    <BouncingLoader />
                  </div>
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

                {nextEpisodeSchedule?.nextEpisodeSchedule && showNextEpisodeSchedule && (
                  <div className="px-3 pb-3">
                    <div className="w-full p-3 rounded-lg bg-[#272727] flex items-center justify-between">
                      <div className="flex items-center gap-x-3">
                        <span className="text-[18px]">🚀</span>
                        <div>
                          <span className="text-gray-400 text-sm">Next episode estimated at</span>
                          <span className="ml-2 text-white text-sm font-medium">
                            {new Date(new Date(nextEpisodeSchedule.nextEpisodeSchedule).getTime() - new Date().getTimezoneOffset() * 60000).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <button className="text-2xl text-gray-500 hover:text-white" onClick={() => setShowNextEpisodeSchedule(false)}>×</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Seasons */}
            {seasons?.length > 0 && (
              <div className="hidden max-[1200px]:block bg-[#141414] rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4 text-white">More Seasons</h2>
                <div className="grid grid-cols-2 gap-2">
                  {seasons.map((season, index) => (
                    <Link to={`/${season.id}`} key={index} className="relative w-full aspect-[3/1] rounded-lg overflow-hidden group">
                      <img src={season.season_poster} alt="" className="w-full h-full object-cover scale-150 opacity-40" />
                      <div className="absolute inset-0 z-30 flex items-center justify-center">
                        <p className="text-[14px] font-bold text-white text-center">{season.season}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Anime Info */}
            <div className="bg-[#141414] rounded-lg p-4">
              <div className="flex gap-x-6">
                {animeInfo?.poster && <img src={animeInfo.poster} alt="" className="w-[120px] h-[180px] object-cover rounded-md" />}
                <div className="flex flex-col gap-y-4 flex-1">
                  <h1 className="text-[28px] font-medium text-white leading-tight">
                    {language ? animeInfo?.title : animeInfo?.japanese_title}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(({ condition, icon, text }, index) => condition && <Tag key={index} bgColor={tags[index].bgColor} icon={icon} text={text} index={index} />)}
                  </div>
                  <p className="text-[15px] text-gray-400 leading-relaxed">
                    {isFullOverview ? animeInfo?.animeInfo?.Overview : `${animeInfo?.animeInfo?.Overview?.slice(0, 270)}...`}
                    <button className="ml-2 text-white" onClick={() => setIsFullOverview(!isFullOverview)}>{isFullOverview ? "Show Less" : "Read More"}</button>
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Seasons */}
            {seasons?.length > 0 && (
              <div className="bg-[#141414] rounded-lg p-4 max-[1200px]:hidden">
                <h2 className="text-xl font-semibold mb-4 text-white">More Seasons</h2>
                <div className="grid grid-cols-4 gap-4">
                  {seasons.map((season, index) => (
                    <Link to={`/${season.id}`} key={index} className="relative w-full aspect-[3/1] rounded-lg overflow-hidden group">
                      <img src={season.season_poster} alt="" className="w-full h-full object-cover scale-150 opacity-40" />
                      <div className="absolute inset-0 z-30 flex items-center justify-center">
                        <p className="text-[16px] font-bold text-white">{season.season}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 h-full max-[1200px]:hidden">
            <div ref={episodesRef} className="episodes flex-shrink-0 bg-[#141414] rounded-lg overflow-hidden">
              {!episodes ? <BouncingLoader /> : (
                <Episodelist
                  episodes={episodes}
                  currentEpisode={episodeId}
                  onEpisodeClick={(id) => setEpisodeId(id)}
                  totalEpisodes={totalEpisodes}
                  isInRoom={isInRoom}
                  isHost={isHost}
                />
              )}
            </div>
            {animeInfo?.related_data && (
              <div className="bg-[#141414] rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4 text-white">Related Anime</h2>
                <Sidecard data={animeInfo.related_data} className="!mt-0" />
              </div>
            )}
          </div>

        </div>
      </div>
      <SharePopup open={showSharePopup} onClose={() => setShowSharePopup(false)} />
      <MultiplayerPanel />
    </div>
  );
}
