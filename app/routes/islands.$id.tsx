import { useContext, useEffect, useState } from "react";
import {
  useLoaderData,
  useNavigation,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import { dataHosts, defaultBounds, indexCollection } from "~/config.ts";
import { fetchPlaceBySlug } from "~/data/coredata";
import FeaturedMedium from "~/components/FeaturedMedium";
import { PlaceContext, MapContext } from "~/contexts";
import RouteError from "~/components/errorResponses/RouteError";
import CodeError from "~/components/errorResponses/CodeError";
import Heading from "~/components/layout/Heading";
import PlaceContent from "~/components/layout/PlaceContent";
import { LngLatBounds } from "maplibre-gl";
import { pageMetadata } from "~/utils/pageMetadata";
import type { TWordPressData } from "~/types";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import type { ESPlace } from "~/esTypes";
import { islandLayerID, islandSourceLayer } from "~/mapStyles";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return pageMetadata(data?.place);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const place: ESPlace = await fetchPlaceBySlug(params.id, indexCollection);

  if (!place) {
    throw new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const wpResponse = await fetch(
    `https://${dataHosts.wordPress}/wp-json/wp/v2/pages/?slug=${params.id}`
  );

  const wpData: TWordPressData[] = await wpResponse.json();

  return { place, wpData: wpData[0] };
};

const IslandPage = () => {
  const { wpData, place } = useLoaderData<typeof loader>();
  const { map, mapLoaded } = useContext(MapContext);
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (!map || !place) return;
    if (navigation.state === "idle") {
      map.removeFeatureState(
        { source: "islands", sourceLayer: islandSourceLayer },
        "hovered"
      );
      map.setFeatureState(
        { source: "islands", id: place.uuid, sourceLayer: islandSourceLayer },
        { hovered: true }
      );
      map.setLayoutProperty(islandLayerID, "visibility", "visible");
    }

    if (navigation.state === "loading") {
      map.setFilter(islandLayerID, undefined);
      map.setFeatureState(
        { source: "islands", id: place.uuid, sourceLayer: islandSourceLayer },
        { hovered: false }
      );
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
  }, [place, map, mapLoaded]);

  return (
    <PlaceContext.Provider
      value={{
        place,
        activeLayers,
        setActiveLayers,
        full: true,
        clusterFillColor: "#ea580c",
        clusterTextColor: "black",
      }}
    >
      <PlaceContent>
        <Heading
          as="h1"
          className="text-2xl px-4 py-2 sticky top-0 z-10 bg-white drop-shadow-md"
        >
          {place.name}
        </Heading>
        <div className="relative -top-12 z-10 min-h-10">
          <FeaturedMedium record={place} />
        </div>
        <div
          className="relative px-4 -mt-12 primary-content"
          dangerouslySetInnerHTML={{
            __html:
              wpData?.content.rendered ??
              place.description ??
              `<p>${place.short_description}</p>`,
          }}
        />
      </PlaceContent>
    </PlaceContext.Provider>
  );
};

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <RouteError error={error} />;
  } else if (error instanceof Error) {
    return <CodeError error={error} />;
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export default IslandPage;
