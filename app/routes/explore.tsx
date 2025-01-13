import { useContext, useState, useEffect } from "react";
import { MapContext } from "~/contexts";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { fetchCounties, fetchPlacesByType } from "~/data/coredata";
import IntroModal from "~/components/layout/IntroModal";
import { defaultBounds, topBarHeight } from "~/config";
import Counties from "~/components/mapping/Counties";
import Islands from "~/components/mapping/Islands";
import type { ESPlace } from "~/esTypes";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Explore the Georgia Coast: Georgia Coast Atlas",
    },
    {
      property: "og:title",
      content: "Explore the Georgia Coast: Georgia Coast Atlas",
    },
    {
      property: "description",
      content: "Explore Georgia's barrier islands and costal counties",
    },
    {
      property: "og:description",
      content: "Explore Georgia's barrier islands and costal counties",
    },
    {
      property: "og:image",
      content: "/images/explore_preview.jpg",
    },
    {
      property: "og:image:width",
      content: 600,
    },
    {
      property: "og:image:height",
      content: 600,
    },
    {
      property: "og:image:alt",
      content:
        "Map of Georgia Coast. The barrier islands are highlighted in blue. The costal counties are highlighted in orange.",
    },
  ];
};

export const loader: LoaderFunction = async () => {
  const islands: ESPlace[] = await fetchPlacesByType("Barrier Island");
  const counties: ESPlace[] = await fetchCounties();
  return { islands, counties };
};

const Explore = () => {
  const { map } = useContext(MapContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state
  const [hoveredIsland, setHoveredIsland] = useState<ESPlace | undefined>(
    undefined
  );
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
      <Counties counties={counties} hoveredIsland={hoveredIsland} />
      <Islands
        islands={islands}
        hoveredIsland={hoveredIsland}
        setHoveredIsland={setHoveredIsland}
      />
    </div>
  );
};

export default Explore;
