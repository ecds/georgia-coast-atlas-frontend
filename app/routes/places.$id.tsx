import { useContext, useEffect, useRef, useState } from "react";
import {
  useLoaderData,
  useLocation,
  useNavigation,
  useNavigate,
} from "@remix-run/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { fetchBySlug } from "~/data/coredata";
import { MapContext, PlaceContext } from "~/contexts";
import Heading from "~/components/layout/Heading";
import FeaturedMedium from "~/components/FeaturedMedium";
import { countyIndexCollection, dataHosts, indexCollection } from "~/config";
import { pageMetadata } from "~/utils/pageMetadata";
import RelatedPlaces from "~/components/relatedRecords/RelatedPlaces";
import RelatedVideos from "~/components/relatedRecords/RelatedVideos";
import RelatedPhotographs from "~/components/relatedRecords/RelatedPhotographs";
import RelatedMapLayers from "~/components/relatedRecords/RelatedMapLayers";
import RelatedTopoQuads from "~/components/relatedRecords/RelatedTopoQuads";
import RelatedPanos from "~/components/relatedRecords/RelatedPanos";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import type { ESPlace, ESRelatedPlace } from "~/esTypes";
import type { TWordPressData } from "~/types";
import type { LngLatBounds } from "maplibre-gl";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return pageMetadata(data?.place);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  let place: ESPlace = await fetchBySlug(params.id, indexCollection);

  if (!place) {
    place = await fetchBySlug(params.id, countyIndexCollection);
  }

  if (!place) {
    throw new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const wpResponse = await fetch(
    `https://${dataHosts.wordPress}/wp-json/wp/v2/pages/?slug=${params.id}`
  );

  let wpData: TWordPressData | undefined = undefined;

  const data = await wpResponse.json();
  if (wpResponse.status === 200 && data.length > 0) {
    wpData = data[0];
  }

  return { place, wpData };
};

const PlacePage = () => {
  const { place, wpData } = useLoaderData<typeof loader>();
  const { map } = useContext(MapContext);
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const [activePlace, setActivePlace] = useState<ESRelatedPlace | undefined>();
  const [hoveredPlace, setHoveredPlace] = useState<
    ESRelatedPlace | undefined
  >();
  const [noTrackMouse, setNoTrackMouse] = useState<boolean>(false);
  const [backTo, setBackTo] = useState<
    | {
        slug: string;
        title: string;
        bounds?: LngLatBounds;
        previous: string;
        search?: string;
      }
    | undefined
  >(undefined);
  const topRef = useRef<HTMLDivElement>(null);
  const navigation = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setBackTo(location.state);
  }, [location]);

  useEffect(() => {
    if (navigation.state === "loading" && map) {
      if (map && map.getLayer(`place-${place.uuid}`))
        map.removeLayer(`place-${place.uuid}`);
    }
  }, [navigation, map, place]);

  const navigateBack = () => {
    // if (backTo?.search) {
    //   navigate(`${backTo.previous}${backTo.search}`, {
    //     // state: { previousBounds: backTo?.bounds ?? undefined },
    //   });
    // } else {
    navigate(-1);
    // }
  };
  useEffect(() => {}, [backTo]);
  return (
    <PlaceContext.Provider
      value={{
        place,
        activeLayers,
        setActiveLayers,
        activePlace,
        setActivePlace,
        hoveredPlace,
        setHoveredPlace,
        noTrackMouse,
        setNoTrackMouse,
        clusterFillColor: "#ea580c",
        clusterTextColor: "black",
      }}
    >
      <>
        {backTo && (
          <nav className="w-full bg-white z-50 sticky top-0 py-2">
            <button
              onClick={navigateBack}
              className="block bg-gray-300 hover:bg-gray-400 border-spacing-1 drop-shadow-sm px-6 py-1 rounded-lg text-left w-max m-2 text-xs"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Back to {backTo.title}
            </button>
          </nav>
        )}
        <Heading
          as="h1"
          className="text-2xl px-4 py-1 pb-1 sticky top-[3.25rem] z-10 bg-white shadow-md"
        >
          {place.name}
        </Heading>
        <div ref={topRef} className="relative -top-16 z-20 min-h-10">
          <FeaturedMedium record={place} />
        </div>
        <div
          className="relative px-4 -mt-16 primary-content min-h-32"
          dangerouslySetInnerHTML={{
            __html:
              wpData?.content.rendered ??
              place.description ??
              `<p>${place.short_description}</p>`,
          }}
        />
        <div className="px-4">
          <RelatedPlaces />
          <RelatedVideos />
          <RelatedPhotographs />
          <RelatedPanos />
          <RelatedMapLayers />
          <RelatedTopoQuads />
        </div>
      </>
    </PlaceContext.Provider>
  );
};

export default PlacePage;
