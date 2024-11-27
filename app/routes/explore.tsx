import { useContext, useState, useEffect, Suspense } from "react";
import { MapContext } from "~/contexts";
import { useLoaderData, useNavigation, Await } from "@remix-run/react";
import { fetchCounties, fetchPlacesByType } from "~/data/coredata";
import IntroModal from "~/components/layout/IntroModal";
import Loading from "~/components/layout/Loading";
import { defaultBounds, topBarHeight } from "~/config";
import type { LoaderFunction } from "@remix-run/node";
import Counties from "~/components/mapping/Counties";
import Islands from "~/components/mapping/Islands";
import type { ESPlace } from "~/esTypes";

export const loader: LoaderFunction = async () => {
  const islands: ESPlace[] = await fetchPlacesByType("Barrier Island");
  const counties: ESPlace[] = await fetchCounties();
  return { islands, counties };
};

export const HydrateFallback = () => {
  return <Loading />;
};

const Explore = () => {
  const { map } = useContext(MapContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state
  const { islands, counties } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  useEffect(() => {
    if (!map) return;
    if (navigation.state === "idle") {
      map.fitBounds(defaultBounds());
      setIsModalOpen(true);
    }
  }, [map, navigation]);

  return (
    <div
      className={`flex flex-row overflow-hidden h-[calc(100vh-${topBarHeight})] max-screen`}
    >
      <IntroModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      <Suspense fallback={<Loading />}>
        <Await resolve={islands}>
          {(resolvedIslands) => (
            <Await resolve={counties}>
              {(resolvedCounties) => (
                <>
                  <Counties counties={resolvedCounties} />
                  <Islands islands={resolvedIslands} />
                </>
              )}
            </Await>
          )}
        </Await>
      </Suspense>
    </div>
  );
};

export default Explore;
