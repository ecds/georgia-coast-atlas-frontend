import { useContext, useState, useEffect, Suspense } from "react";
import { MapContext } from "~/contexts";
import { useLoaderData, defer, useNavigation } from "@remix-run/react";
import { fetchCounties, fetchPlacesByType } from "~/data/coredata";
import IntroModal from "~/components/layout/IntroModal";
import Loading from "~/components/layout/Loading";
import { defaultBounds, topBarHeight } from "~/config";
import type { TCounty, TPlace } from "~/types";
import type { LoaderFunction } from "@remix-run/node";
import Counties from "~/components/mapping/Counties";
import Islands from "~/components/mapping/Islands";

export const loader: LoaderFunction = async () => {
  const islands: TPlace[] = await fetchPlacesByType("Barrier Island");
  const counties: TCounty[] = await fetchCounties();
  return defer({ islands, counties });
};

export const HydrateFallback = () => {
  return <Loading />;
};

const Explore = () => {
  const { map } = useContext(MapContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true); // Modal state
  const { islands, counties } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  useEffect(() => {
    if (!map) return;
    if (navigation.state === "idle") map.fitBounds(defaultBounds());
  }, [map, navigation]);

  return (
    <div
      className={`flex flex-row overflow-hidden h-[calc(100vh-${topBarHeight})] max-screen`}
    >
      {isModalOpen && <IntroModal setIsOpen={setIsModalOpen} />}{" "}
      <Suspense fallback={<Loading />}>
        <Counties counties={counties} />
        <Islands islands={islands} />
      </Suspense>
    </div>
  );
};

export default Explore;
