import HeroSlider from "@/components/HeroSlider";
import HomeLists from "@/components/HomeLists";
import PosterCard from "@/components/PosterCard";
import { getHomeAnime } from "@/lib/data";

export default async function Home() {
  const list = await getHomeAnime();

  const withBanner = list.filter((a) => a.banner);
  const spotlight = (withBanner.length ? withBanner : list).slice(0, 5);
  const airing = list.filter((a) => a.status === "RELEASING");

  return (
    <main>
      <HeroSlider items={spotlight} />

      <HomeLists />

      {airing.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pt-10">
          <h2 className="mb-5 border-l-4 border-pink-500 pl-3 text-xl font-bold">Now Airing</h2>
          <div className="flex gap-5 overflow-x-auto pb-3">
            {airing.map((a) => (
              <div key={a.id} className="w-40 shrink-0 sm:w-44">
                <PosterCard a={a} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="mb-5 border-l-4 border-pink-500 pl-3 text-xl font-bold">All Anime</h2>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {list.map((a) => (
            <PosterCard key={a.id} a={a} />
          ))}
        </div>
      </section>
    </main>
  );
}