import Spotlight from "@/src/components/spotlight/Spotlight";
import Trending from "@/src/components/trending/Trending";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import Genre from "@/src/components/genres/Genre";
import Topten from "@/src/components/topten/Topten";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import { useHomeInfo } from "@/src/context/HomeInfoContext";
import Schedule from "@/src/components/schedule/Schedule";
import ContinueWatching from "@/src/components/continue/ContinueWatching";
import TabbedAnimeSection from "@/src/components/tabbed-anime/TabbedAnimeSection";
import JoinRoomPanel from "@/src/components/multiplayer/JoinRoomPanel";
import CommunityChat from "@/src/components/community/CommunityChat";

function Home() {
  const { homeInfo, homeInfoLoading, error } = useHomeInfo();

  if (homeInfoLoading) return <Loader type="home" />;
  if (error || !homeInfo) return <Error />;

  return (
    <>
      <JoinRoomPanel />

      <div className="pt-16 w-full">
        <Spotlight spotlights={homeInfo.spotlights} />

        <div className="mt-6">
          <Genre data={homeInfo.genres} />
        </div>

        <ContinueWatching />

        <div className="w-full grid grid-cols-[75%,25%] gap-x-6 max-[1200px]:flex max-[1200px]:flex-col">
          <div>
            <CategoryCard
              label="Latest Episode"
              data={homeInfo.latest_episode}
              className="mt-[60px]"
              path="recently-updated"
              limit={12}
            />

            <Schedule className="mt-8" />

            <TabbedAnimeSection
              topAiring={homeInfo.top_airing}
              mostFavorite={homeInfo.most_favorite}
              latestCompleted={homeInfo.latest_completed}
              className="mt-8"
            />
          </div>

          <div className="w-full mt-[60px]">
            <Trending trending={homeInfo.trending} />
            <Topten data={homeInfo.topten} className="mt-12" />
          </div>
        </div>

        <CommunityChat />
      </div>
    </>
  );
}

export default Home;
