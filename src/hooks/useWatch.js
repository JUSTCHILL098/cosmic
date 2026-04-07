/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import getEpisodes from "@/src/utils/getEpisodes.utils";
import getServers from "../utils/getServers.utils";
import getStreamInfo from "../utils/getStreamInfo.utils";

export const useWatch = (animeId, initialEpisodeId) => {
  const [error, setError] = useState(null);
  const [buffering, setBuffering] = useState(true);
  const [streamInfo, setStreamInfo] = useState(null);
  const [animeInfo, setAnimeInfo] = useState(null);
  const [episodes, setEpisodes] = useState(null);
  const [animeInfoLoading, setAnimeInfoLoading] = useState(false);
  const [totalEpisodes, setTotalEpisodes] = useState(null);
  const [seasons, setSeasons] = useState(null);
  const [servers, setServers] = useState(null);
  const [streamUrl, setStreamUrl] = useState(null);
  const [isFullOverview, setIsFullOverview] = useState(false);
  const [subtitles, setSubtitles] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [intro, setIntro] = useState(null);
  const [outro, setOutro] = useState(null);
  const [episodeId, setEpisodeId] = useState(null);
  const [activeEpisodeNum, setActiveEpisodeNum] = useState(null);
  const [activeServerId, setActiveServerId] = useState(null);
  const [activeServerType, setActiveServerType] = useState(null);
  const [activeServerName, setActiveServerName] = useState(null);
  const [serverLoading, setServerLoading] = useState(true);
  const [nextEpisodeSchedule, setNextEpisodeSchedule] = useState(null);

  const isServerFetchInProgress = useRef(false);
  const isStreamFetchInProgress = useRef(false);

  // Reset everything when animeId changes
  useEffect(() => {
    setEpisodes(null);
    setEpisodeId(null);
    setActiveEpisodeNum(null);
    setServers(null);
    setActiveServerId(null);
    setStreamInfo(null);
    setStreamUrl(null);
    setSubtitles([]);
    setThumbnail(null);
    setIntro(null);
    setOutro(null);
    setBuffering(true);
    setServerLoading(true);
    setError(null);
    setAnimeInfo(null);
    setSeasons(null);
    setTotalEpisodes(null);
    setAnimeInfoLoading(true);
    isServerFetchInProgress.current = false;
    isStreamFetchInProgress.current = false;
  }, [animeId]);

  // Fetch anime info + episodes
  useEffect(() => {
    if (!animeId) return;
    const fetchInitialData = async () => {
      try {
        setAnimeInfoLoading(true);
        const [animeData, episodesData] = await Promise.all([
          getAnimeInfo(animeId, false),
          getEpisodes(animeId),
        ]);
        setAnimeInfo(animeData?.data);
        setSeasons(animeData?.seasons);
        setEpisodes(episodesData?.episodes);
        setTotalEpisodes(episodesData?.totalEpisodes);
        const newEpisodeId =
          initialEpisodeId ||
          (episodesData?.episodes?.length > 0
            ? episodesData.episodes[0].id.match(/ep=(\d+)/)?.[1]
            : null);
        setEpisodeId(newEpisodeId);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError(err.message || "An error occurred.");
      } finally {
        setAnimeInfoLoading(false);
      }
    };
    fetchInitialData();
  }, [animeId]);

  // Derive active episode number
  useEffect(() => {
    if (!episodes || !episodeId) { setActiveEpisodeNum(null); return; }
    const activeEpisode = episodes.find((ep) => {
      const match = ep.id.match(/ep=(\d+)/);
      return match && match[1] === episodeId;
    });
    const num = activeEpisode ? activeEpisode.episode_no : null;
    if (activeEpisodeNum !== num) setActiveEpisodeNum(num);
  }, [episodeId, episodes]);

  // Fetch servers when episodeId changes
  useEffect(() => {
    if (!episodeId || !episodes || isServerFetchInProgress.current) return;
    let mounted = true;
    const controller = new AbortController();
    isServerFetchInProgress.current = true;
    setServerLoading(true);

    const fetchServers = async () => {
      try {
        const data = await getServers(animeId, episodeId, { signal: controller.signal });
        if (!mounted) return;

        // Allow HD-1, HD-2, HD-3 and popular providers
        const allowedServers = ["HD-1", "HD-2", "HD-3", "Vidstreaming", "Vidcloud", "MegaCloud"];
        const filteredServers = data?.filter(s => allowedServers.includes(s.serverName)) || [];

        const savedServerName = localStorage.getItem("server_name");
        const savedServerType = localStorage.getItem("server_type");

        // Priority: saved preference → HD-2 → HD-1 → first available
        const initialServer =
          filteredServers.find(s => s.serverName === savedServerName && s.type === savedServerType) ||
          filteredServers.find(s => s.serverName === savedServerName) ||
          filteredServers.find(s => s.serverName === "HD-2" && s.type === "sub") ||
          filteredServers.find(s => s.serverName === "HD-2") ||
          filteredServers.find(s => s.serverName === "HD-1" && s.type === "sub") ||
          filteredServers.find(s => s.serverName === "HD-1") ||
          filteredServers[0];

        setServers(filteredServers);
        setActiveServerType(initialServer?.type);
        setActiveServerName(initialServer?.serverName);
        setActiveServerId(initialServer?.data_id);
      } catch (err) {
        if (err?.name === "AbortError") return;
        console.error("Error fetching servers:", err);
        if (mounted) setError(err.message || "An error occurred.");
      } finally {
        if (mounted) { setServerLoading(false); isServerFetchInProgress.current = false; }
      }
    };
    fetchServers();
    return () => {
      mounted = false;
      try { controller.abort(); } catch (e) {}
      isServerFetchInProgress.current = false;
    };
  }, [episodeId, episodes]);

  // Sync server name/type when activeServerId changes
  useEffect(() => {
    if (!servers || !activeServerId) return;
    const srv = servers.find(s => s.data_id === activeServerId);
    if (srv) { setActiveServerName(srv.serverName); setActiveServerType(srv.type); }
  }, [activeServerId, servers]);

  // Fetch stream
  useEffect(() => {
    if (!episodeId || !activeServerId || !servers || isServerFetchInProgress.current || isStreamFetchInProgress.current) return;
    const iframeServers = [];
    if (iframeServers.includes(activeServerName?.toLowerCase()) && !serverLoading) {
      setBuffering(false);
      return;
    }
    const fetchStreamInfo = async () => {
      isStreamFetchInProgress.current = true;
      setBuffering(true);
      try {
        const server = servers.find(s => s.data_id === activeServerId);
        if (!server) { setError("No server found."); return; }

        // HD-3 maps to hd-1 on the API; HD-2 also falls back to hd-1 since proxy returns 500
        const apiServerName = ["hd-2", "hd-3"].includes(server.serverName.toLowerCase())
          ? "hd-1"
          : server.serverName.toLowerCase();

        const data = await getStreamInfo(animeId, episodeId, apiServerName, server.type.toLowerCase());

        setStreamInfo(data);
        const url = data?.streamingLink?.[0]?.link || null;
        setStreamUrl(url);
        setIntro(data?.intro || null);
        setOutro(data?.outro || null);

        // Collect subtitles — include both "captions" and "subtitles" kinds
        let subs = (data?.tracks || [])
          .filter(t => t.kind === "captions" || t.kind === "subtitles")
          .map(({ file, label, kind, default: isDefault }) => ({ file, label, kind, default: isDefault }));

        // If dub stream has no subtitle tracks, fetch them from the sub stream
        if (subs.length === 0 && server.type.toLowerCase() === "dub") {
          try {
            const subData = await getStreamInfo(animeId, episodeId, apiServerName, "sub");
            const subTracks = (subData?.tracks || [])
              .filter(t => t.kind === "captions" || t.kind === "subtitles")
              .map(({ file, label, kind, default: isDefault }) => ({ file, label, kind, default: isDefault }));
            subs = subTracks;
          } catch {}
        }

        setSubtitles(subs);

        const thumbTrack = data?.tracks?.find(t => t.kind === "thumbnails" && t.file);
        if (thumbTrack) setThumbnail(thumbTrack.file);
      } catch (err) {
        console.error("Error fetching stream info:", err);
        setError(err.message || "An error occurred.");
      } finally {
        setBuffering(false);
        isStreamFetchInProgress.current = false;
      }
    };
    fetchStreamInfo();
  }, [episodeId, activeServerId, servers]);

  return {
    error, buffering, serverLoading, streamInfo, animeInfo, episodes,
    nextEpisodeSchedule, animeInfoLoading, totalEpisodes, seasons, servers,
    streamUrl, isFullOverview, setIsFullOverview, subtitles, thumbnail,
    intro, outro, episodeId, setEpisodeId, activeEpisodeNum, setActiveEpisodeNum,
    activeServerId, setActiveServerId, activeServerType, setActiveServerType,
    activeServerName, setActiveServerName,
  };
};
