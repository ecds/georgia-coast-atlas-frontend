import { Await, useLoaderData, useNavigation } from "@remix-run/react";
import { fetchPlaceBySlug } from "~/data/coredata";
import { useContext, useEffect } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import Heading from "~/components/layout/Heading";
import { counties as countyStyle } from "~/mapStyles";
import { countyIndexCollection, defaultBounds } from "~/config";
import RelatedPlaces from "~/components/relatedRecords/RelatedPlaces";
import { LngLatBounds } from "maplibre-gl";
import { pageMetadata } from "~/utils/pageMetadata";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import type { ESPlace } from "~/esTypes";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return pageMetadata(data?.place);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const place: ESPlace = await fetchPlaceBySlug(
    params.id,
    countyIndexCollection
  );

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

  useEffect(() => {
    if (navigation.state === "idle" && map) {
      for (const countyLayer of countyStyle.layers) {
        map.setFilter(countyLayer.id, ["==", ["get", "uuid"], place.uuid]);
        map.setLayoutProperty(countyLayer.id, "visibility", "visible");
      }
    }

    if (navigation.state === "loading" && map) {
      for (const countyLayer of countyStyle.layers) {
        map.setFilter(countyLayer.id, undefined);
        map.setLayoutProperty(countyLayer.id, "visibility", "none");
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
          value={{ place: resolvedPlace, full: true, relatedClosed: true }}
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

            <RelatedPlaces />
          </div>

          {/* <PlaceContent>
          </PlaceContent> */}
        </PlaceContext.Provider>
      )}
    </Await>
  );
};

export default CountyPage;
