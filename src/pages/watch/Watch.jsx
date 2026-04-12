/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/src/context/LanguageContext";
import { useWatch } from "@/src/hooks/useWatch";
import BouncingLoader from "@/src/components/ui/bouncingloader/Bouncingloader";
import Episodelist from "@/src/components/episodelist/Episodelist";
import website_name from "@/src/config/website";
import Sidecard from "@/src/components/sidecard/Sidecard";
import SharePopup from "@/src/components/share/SharePopup";
import { faClosedCaptioning, faMicrophone, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Servers from "@/src/components/servers/Servers";
import { Skeleton } from "@/src/components/ui/Skeleton/Skeleton";
import SidecardLoader from "@/src/components/Loader/Sidecard.loader";
import Watchcontrols from "@/src/components/watchcontrols/Watchcontrols";
import useWatchControl from "@/src/hooks/useWatchControl";
import Player from "@/src/components/player/Player";
import RoomStatus from "@/src/components/multiplayer/RoomStatus";
import WatchTogether from "@/src/components/multiplayer/WatchTogether";
import { useMultiplayer } from "@/src/context/MultiplayerContext";
import { motion } from "framer-motion";
import { saveProgress } from "@/src/utils/continueWatching.utils";

const CARD = { background: "#111", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12 };

const GlassPill = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono"
    style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)", color:"rgba(255,255,255,0.7)" }}>
    {children}
  </span>
);

export default function Watch() {
  const [showSharePopup, setShowSharePopup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id: animeId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const initialEpisodeId = queryParams.get("ep");
  const roomParam = queryParams.get("room");
  const { language } = useLanguage();
  const isFirstSet = useRef(true);
  const [showNextEp, setShowNextEp] = useState(true);
  const nativePlayerRef = useRef(null);

  const { isInRoom, isHost, roomCode, syncVideo, syncEpisodeChange, joinRoom, setPlayerReference } = useMultiplayer();

  const {
    buffering, streamUrl, animeInfo, episodes, nextEpisodeSchedule,
    totalEpisodes, seasons, episodeId, setEpisodeId,
    activeServerId, setActiveServerId, servers, serverLoading,
    activeServerType, setActiveServerType, activeServerName, setActiveServerName,
    activeEpisodeNum, subtitles, isFullOverview, setIsFullOverview,
    intro, outro,
  } = useWatch(animeId, initialEpisodeId);

  const { autoPlay, setAutoPlay, autoSkipIntro, setAutoSkipIntro, autoNext, setAutoNext } = useWatchControl();

  const episodesRef = useRef(null);
  const videoRef    = useRef(null);
  const ctrlRef     = useRef(null);

  // Auto-join room from URL param
  useEffect(() => {
    if (roomParam && !isInRoom) joinRoom(roomParam);
  }, [roomParam]);

  // Listen for episode changes from room host
  useEffect(() => {
    const handler = (e) => setEpisodeId(e.detail);
    window.addEventListener("w2g_episode", handler);
    return () => window.removeEventListener("w2g_episode", handler);
  }, [setEpisodeId]);

  // Sync episode changes to room members (host only)
  useEffect(() => {
    if (isInRoom && isHost && episodeId) syncEpisodeChange(episodeId);
  }, [episodeId]);

  useEffect(() => {
    if (!episodes || episodes.length === 0) return;
    const isValid = episodes.some(ep => ep.id.split("ep=")[1] === episodeId);
    if (!episodeId || !isValid) {
      const fb = episodes[0].id.match(/ep=(\d+)/)?.[1];
      if (fb && fb !== episodeId) setEpisodeId(fb);
      return;
    }
    const url = "/watch/" + animeId + "?ep=" + episodeId + (roomCode ? "&room=" + roomCode : "");
    if (isFirstSet.current) { navigate(url, { replace: true }); isFirstSet.current = false; }
    else navigate(url);
  }, [episodeId, animeId, navigate, episodes, roomCode]);

  useEffect(() => {
    if (animeInfo) document.title = "Watch " + animeInfo.title + " on " + website_name;
    return () => { document.title = website_name + " | Free anime streaming"; };
  }, [animeId, animeInfo]);

  useEffect(() => {
    if (totalEpisodes !== null && totalEpisodes === 0) navigate("/" + animeId);
  }, [totalEpisodes, animeId, navigate]);

  useEffect(() => {
    const adj = () => {
      if (window.innerWidth > 1200 && videoRef.current && ctrlRef.current && episodesRef.current) {
        episodesRef.current.style.height = (videoRef.current.offsetHeight + ctrlRef.current.offsetHeight) + "px";
      } else if (episodesRef.current) {
        episodesRef.current.style.height = "auto";
      }
    };
    const t = setTimeout(adj, 500);
    window.addEventListener("resize", adj);
    const iv = setInterval(adj, 1000);
    return () => { clearTimeout(t); clearInterval(iv); window.removeEventListener("resize", adj); };
  }, [buffering, episodeId, streamUrl, episodes]);

  // Wire native video element to multiplayer for sync
  const handlePlayerReady = (el) => {
    nativePlayerRef.current = el;
    setPlayerReference(el);
    if (!el || !isInRoom) return;
    const onPlay  = () => { if (isHost) syncVideo("play",  el.currentTime); };
    const onPause = () => { if (isHost) syncVideo("pause", el.currentTime); };
    const onSeek  = () => { if (isHost) syncVideo("seek",  el.currentTime); };
    el.addEventListener("play",     onPlay);
    el.addEventListener("pause",    onPause);
    el.addEventListener("seeked",   onSeek);
    return () => { el.removeEventListener("play", onPlay); el.removeEventListener("pause", onPause); el.removeEventListener("seeked", onSeek); };
  };

  const info    = animeInfo?.animeInfo;
  const tvInfo  = info?.tvInfo || {};
  const overview = info?.Overview || "";

  return (
    <div className="w-full min-h-screen" style={{ background: "#000" }}>
      <div className="w-full max-w-[1920px] mx-auto pt-16 pb-10 max-[1200px]:pt-12 px-4">
        <div className="grid grid-cols-[minmax(0,75%),minmax(0,25%)] gap-4 w-full max-[1200px]:flex max-[1200px]:flex-col">

          {/* LEFT */}
          <div className="flex flex-col w-full gap-3">
            <RoomStatus />

            {/* 1. Player */}
            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }}
              className="rounded-xl overflow-hidden" style={{ background:"#000", border:"1px solid rgba(255,255,255,0.09)" }}>
              <div ref={videoRef} className="w-full relative aspect-video bg-black">
                {!buffering ? (
                  <Player
                    key={episodeId + "-" + activeServerId}
                    streamUrl={streamUrl}
                    subtitles={subtitles}
                    onMediaError={() => {}}
                    onTimeUpdate={(currentTime, duration) => {
                      if (!animeInfo || !episodeId) return;
                      saveProgress({
                        id: animeId,
                        episodeId,
                        episodeNum: activeEpisodeNum,
                        title: animeInfo.title,
                        japanese_title: animeInfo.japanese_title,
                        poster: animeInfo.poster,
                        adultContent: animeInfo.adultContent,
                        currentTime,
                        duration,
                      });
                    }}
                    crossOrigin="anonymous"
                    intro={intro}
                    outro={outro}
                    autoSkipIntro={autoSkipIntro}
                    onPlayerReady={handlePlayerReady}
                  />
                ) : (
                  <div className="absolute inset-0 flex justify-center items-center bg-black">
                    <BouncingLoader />
                  </div>
                )}
              </div>
            </motion.div>

            {/* 2. Controls — black card */}
            <div ref={ctrlRef} className="rounded-xl overflow-hidden" style={{ background:"#000", border:"1px solid rgba(255,255,255,0.09)", borderRadius:12 }}>
              <Watchcontrols
                autoPlay={autoPlay} setAutoPlay={setAutoPlay}
                autoSkipIntro={autoSkipIntro} setAutoSkipIntro={setAutoSkipIntro}
                autoNext={autoNext} setAutoNext={setAutoNext}
                episodes={episodes} totalEpisodes={totalEpisodes}
                episodeId={episodeId} onButtonClick={(id) => setEpisodeId(id)}
                isInRoom={isInRoom} isHost={isHost}
              />
            </div>

            {/* 2b. Servers — separate black card */}
            <div className="rounded-xl" style={{ background:"#000", border:"1px solid rgba(255,255,255,0.09)", borderRadius:12, overflow:"visible" }}>
              <div className="px-3 py-2.5">
                <Servers
                  servers={servers} activeEpisodeNum={activeEpisodeNum}
                  episodeId={episodeId}
                  activeServerId={activeServerId} setActiveServerId={setActiveServerId}
                  serverLoading={serverLoading} setActiveServerType={setActiveServerType}
                  activeServerType={activeServerType} setActiveServerName={setActiveServerName}
                />
              </div>
              {nextEpisodeSchedule?.nextEpisodeSchedule && showNextEp && (
                <div className="px-3 pb-3">
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>
                    <div className="flex items-center gap-2">
                      <span>🚀</span>
                      <span className="text-white/40 text-xs font-mono">Next ep: </span>
                      <span className="text-white text-xs font-mono font-semibold">
                        {new Date(new Date(nextEpisodeSchedule.nextEpisodeSchedule).getTime() - new Date().getTimezoneOffset() * 60000)
                          .toLocaleDateString("en-GB", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit", hour12:true })}
                      </span>
                    </div>
                    <button className="text-white/25 hover:text-white transition-colors" onClick={() => setShowNextEp(false)}>x</button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile episodes */}
            <div className="hidden max-[1200px]:block">
              <div ref={episodesRef} className="rounded-xl overflow-hidden" style={CARD}>
                {!episodes
                  ? <div className="flex items-center justify-center p-8"><BouncingLoader /></div>
                  : <Episodelist episodes={episodes} currentEpisode={episodeId} onEpisodeClick={(id) => setEpisodeId(id)} totalEpisodes={totalEpisodes} isInRoom={isInRoom} isHost={isHost} />}
              </div>
            </div>

            {/* 3. Anime info */}
            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3, delay:0.1 }}
              className="rounded-xl overflow-hidden" style={{ background:"#000", border:"1px solid rgba(255,255,255,0.09)", borderRadius:12 }}>
              <div className="px-5 py-5">
                <div className="flex gap-5">
                  {/* Big poster */}
                  <div className="flex-shrink-0">
                    {animeInfo?.poster
                      ? <img src={animeInfo.poster} alt="" className="w-[140px] h-[200px] object-cover rounded-xl shadow-2xl" style={{ border:"1px solid rgba(255,255,255,0.12)" }} />
                      : <Skeleton className="w-[140px] h-[200px] rounded-xl" />}
                  </div>

                  <div className="flex flex-col gap-3 flex-1 min-w-0">
                    {/* Title */}
                    {animeInfo?.title
                      ? <Link to={"/" + animeId}>
                          <h1 className="text-2xl font-black text-white leading-tight tracking-tight hover:text-white/70 transition-colors">
                            {language ? animeInfo.title : animeInfo.japanese_title}
                          </h1>
                        </Link>
                      : <Skeleton className="w-56 h-7 rounded" />}

                    {/* Colored badge pills */}
                    <div className="flex flex-wrap gap-2">
                      {tvInfo.rating && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold" style={{ background:"rgba(251,191,36,0.15)", border:"1px solid rgba(251,191,36,0.35)", color:"#fbbf24" }}>
                          <FontAwesomeIcon icon={faStar} className="text-[9px]" />{tvInfo.rating}
                        </span>
                      )}
                      {tvInfo.quality && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold" style={{ background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.35)", color:"#818cf8" }}>
                          {tvInfo.quality}
                        </span>
                      )}
                      {tvInfo.sub && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold" style={{ background:"rgba(34,197,94,0.15)", border:"1px solid rgba(34,197,94,0.35)", color:"#4ade80" }}>
                          <FontAwesomeIcon icon={faClosedCaptioning} className="text-[9px]" />SUB {tvInfo.sub}
                        </span>
                      )}
                      {tvInfo.dub && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold" style={{ background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.35)", color:"#60a5fa" }}>
                          <FontAwesomeIcon icon={faMicrophone} className="text-[9px]" />DUB {tvInfo.dub}
                        </span>
                      )}
                      {tvInfo.eps && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold" style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.7)" }}>
                          {tvInfo.eps} eps
                        </span>
                      )}
                    </div>

                    {/* Meta row */}
                    {info && (
                      <div className="flex flex-wrap gap-x-5 gap-y-1">
                        {[{l:"Type",v:info.Type},{l:"Status",v:info.Status},{l:"Aired",v:info.Aired},{l:"Studio",v:info.Studios}].filter(m=>m.v).map(m=>(
                          <div key={m.l} className="flex items-center gap-1.5">
                            <span className="text-[10px] text-white/25 uppercase tracking-wider">{m.l}</span>
                            <span className="text-[10px] text-white/60">{m.v}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Genre tags — colored */}
                    {info?.Genres?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {info.Genres.map((g, i) => {
                          const colors = [
                            { bg:"rgba(239,68,68,0.12)",   border:"rgba(239,68,68,0.3)",   text:"#f87171" },
                            { bg:"rgba(249,115,22,0.12)",  border:"rgba(249,115,22,0.3)",  text:"#fb923c" },
                            { bg:"rgba(234,179,8,0.12)",   border:"rgba(234,179,8,0.3)",   text:"#facc15" },
                            { bg:"rgba(34,197,94,0.12)",   border:"rgba(34,197,94,0.3)",   text:"#4ade80" },
                            { bg:"rgba(6,182,212,0.12)",   border:"rgba(6,182,212,0.3)",   text:"#22d3ee" },
                            { bg:"rgba(99,102,241,0.12)",  border:"rgba(99,102,241,0.3)",  text:"#818cf8" },
                            { bg:"rgba(168,85,247,0.12)",  border:"rgba(168,85,247,0.3)",  text:"#c084fc" },
                            { bg:"rgba(236,72,153,0.12)",  border:"rgba(236,72,153,0.3)",  text:"#f472b6" },
                          ];
                          const c = colors[i % colors.length];
                          return (
                            <Link key={i} to={`/genre/${g.split(" ").join("-")}`}
                              className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all"
                              style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
                              {g}
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    {/* Overview — no truncation */}
                    {overview && (
                      <p className="text-sm text-white/40 leading-relaxed">{overview}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 4. Seasons */}
            {seasons?.length > 0 && (
              <div className="rounded-xl p-4 max-[1200px]:hidden" style={CARD}>
                <h2 className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-3">More Seasons</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {seasons.map((s, i) => (
                    <Link to={"/" + s.id} key={i}
                      className="relative aspect-[3/1] rounded-lg overflow-hidden group"
                      style={{ background:"#000", border: animeId === String(s.id) ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.08)" }}>
                      <img src={s.season_poster} alt="" className="w-full h-full object-cover scale-150 opacity-20 group-hover:opacity-40 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-[11px] font-bold text-white text-center px-2 font-mono">{s.season}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-3 max-[1200px]:hidden">
            <div ref={episodesRef} className="rounded-xl overflow-hidden" style={CARD}>
              {!episodes
                ? <div className="flex items-center justify-center p-8"><BouncingLoader /></div>
                : <Episodelist episodes={episodes} currentEpisode={episodeId} onEpisodeClick={(id) => setEpisodeId(id)} totalEpisodes={totalEpisodes} isInRoom={isInRoom} isHost={isHost} />}
            </div>
            {animeInfo?.related_data
              ? <div className="rounded-xl p-4" style={CARD}><h2 className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-3">Related</h2><Sidecard data={animeInfo.related_data} className="!mt-0" /></div>
              : <SidecardLoader />}
          </div>

          {/* Mobile related */}
          {animeInfo?.related_data && (
            <div className="hidden max-[1200px]:block rounded-xl p-4" style={CARD}>
              <h2 className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-3">Related</h2>
              <Sidecard data={animeInfo.related_data} className="!mt-0" />
            </div>
          )}
        </div>
      </div>
      <SharePopup open={showSharePopup} onClose={() => setShowSharePopup(false)} />
      <WatchTogether />
    </div>
  );
}


