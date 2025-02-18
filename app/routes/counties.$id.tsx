import { Await, useLoaderData, useNavigation } from "@remix-run/react";
import { fetchBySlug } from "~/data/coredata";
import { useContext, useEffect, useState } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import Heading from "~/components/layout/Heading";
import { counties as countyStyle } from "~/mapStyles";
import { countyIndexCollection, defaultBounds } from "~/config";
import RelatedPlacesList from "~/components/relatedRecords/RelatedPlacesList";
import { LngLatBounds } from "maplibre-gl";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import type { ESPlace, ESRelatedPlace } from "~/esTypes";
import { pageMetadata } from "~/utils/pageMetadata";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return pageMetadata(data?.place);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const place: ESPlace = await fetchBySlug(params.id, countyIndexCollection);

  if (!place) {
    throw new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return { place };
};

const CountyPage = () => {
  const { place } = useLoaderData<typeof loader>();
  const { map } = useContext(MapContext);
  const navigation = useNavigation();
  const [activePlace, setActivePlace] = useState<ESRelatedPlace | undefined>();
  const [hoveredPlace, setHoveredPlace] = useState<
    ESRelatedPlace | undefined
  >();

  useEffect(() => {
    if (navigation.state === "idle" && map) {
      for (const countyLayer of countyStyle.layers) {
        map.setFilter(countyLayer.id, ["==", ["get", "uuid"], place.uuid]);
        map.setLayoutProperty(countyLayer.id, "visibility", "visible");
      }
    }
  }, [navigation, map, place]);

  useEffect(() => {
    if (navigation.state === "loading" && map) {
      for (const islandLayer of countyStyle.layers) {
        map.setFilter(islandLayer.id, undefined);
        map.setLayoutProperty(islandLayer.id, "visibility", "none");
      }
    }
  }, [navigation, place, map]);

  useEffect(() => {
    if (!place || !place.bbox || !map) return;
    const fitBounds = () => {
      const bounds = new LngLatBounds(place.bbox);
      map.fitBounds(bounds);
      map.fitBounds(bounds);
    };
    map.on("resize", fitBounds);
    fitBounds();

    return () => {
      map.fitBounds(defaultBounds());
      map.off("resize", fitBounds);
    };
  }, [place, map]);

  return (
    <Await resolve={place}>
      {(resolvedPlace) => (
        <PlaceContext.Provider
          value={{
            place: resolvedPlace,
            full: true,
            relatedClosed: true,
            activePlace,
            setActivePlace,
            hoveredPlace,
            setHoveredPlace,
          }}
        >
          <div className="w-full md:w-1/2 lg:w-2/5 overflow-scroll pb-32">
            <div className="flex flex-col">
              <Heading
                as="h1"
                className="text-2xl px-4 pt-4 sticky top-0 z-10 bg-white"
              >
                {place.name}
              </Heading>
              <div
                className="relative px-4 -mt-12 primary-content"
                dangerouslySetInnerHTML={{
                  __html:
                    resolvedPlace.description ??
                    `<div class="h-16 mt-16">Placeholder content for ${place.name} County</div>`,
                }}
              />
            </div>

            <RelatedPlacesList />
          </div>

          {/* <PlaceContent>
          </PlaceContent> */}
        </PlaceContext.Provider>
      )}
    </Await>
  );
};

export default CountyPage;
