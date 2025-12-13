import Spotlight from "@/src/components/spotlight/Spotlight.jsx";
import Trending from "@/src/components/trending/Trending.jsx";
import CategoryCard from "@/src/components/categorycard/CategoryCard.jsx";
import Genre from "@/src/components/genres/Genre.jsx";
import Topten from "@/src/components/topten/Topten.jsx";
import Loader from "@/src/components/Loader/Loader.jsx";
import Error from "@/src/components/error/Error.jsx";
import { useHomeInfo } from "@/src/context/HomeInfoContext.jsx";
import Schedule from "@/src/components/schedule/Schedule";
import ContinueWatching from "@/src/components/continue/ContinueWatching";
import TabbedAnimeSection from "@/src/components/tabbed-anime/TabbedAnimeSection";
import JoinRoomPanel from "@/src/components/multiplayer/JoinRoomPanel.jsx";

function Home() {
  const { homeInfo, homeInfoLoading, error } = useHomeInfo();

  if (homeInfoLoading) return <Loader type="home" />;
  if (error || !homeInfo) return <Error />;

  console.log("✅ TOPTEN DATA =>", homeInfo.topten);

  return (
    <>
      <JoinRoomPanel />

      <div className="pt-16 w-full">
        <Spotlight spotlights={homeInfo.spotlights} />

        <div className="mt-6">
          <Genre data={homeInfo.genres} />
        </div>

        <ContinueWatching />

        <div className="w-full grid grid-cols-[minmax(0,75%),minmax(0,25%)] gap-x-6 max-[1200px]:flex max-[1200px]:flex-col">
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

            {/* ✅ NOW THIS WORKS */}
            <Topten data={homeInfo.topten} className="mt-12" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
