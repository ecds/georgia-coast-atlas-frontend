import { LngLatBounds } from "maplibre-gl";
import { bbox } from "@turf/turf";
import { useEffect, useRef, useState } from "react";
import {
  useLoaderData,
  useNavigation,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import { islands, dataHosts, topBarHeight } from "~/config.ts";
import { fetchPlaceRecord, fetchRelatedRecords } from "~/data/coredata";
import Map from "~/components/Map.client";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import RelatedPlaces from "~/components/RelatedPlaces";
import FeaturedMedium from "~/components/FeaturedMedium";
import RelatedVideos from "~/components/RelatedVideos";
import { PlaceContext, MapContext } from "~/contexts";
import RelatedPhotographs from "~/components/RelatedPhotographs";
import MapSwitcher from "~/components/MapSwitcher";
import TopoQuads from "~/components/mapping/TopoQuads";
import RouteError from "~/components/errorResponses/RouteError";
import CodeError from "~/components/errorResponses/CodeError";
import Loading from "~/components/layout/Loading";
import type {
  TWordPressData,
  TIslandServerData,
  TIslandClientData,
  TRelatedCoreDataRecords,
} from "~/types";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import type { Map as TMap } from "maplibre-gl";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const island = islands.find((i) => params.id == `${i.id}`);

  if (!island) {
    throw new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const place = await fetchPlaceRecord(island?.coreDataId);
  const wpResponse = await fetch(
    `https://${dataHosts.wordPress}/wp-json/wp/v2/pages/?slug=${params.id}-island`,
  );

  const wpData: TWordPressData[] = await wpResponse.json();

  return { place, island, wpData: wpData[0] } || null;
};

export const clientLoader = async ({
  serverLoader,
}: ClientLoaderFunctionArgs) => {
  const serverData = await serverLoader<TIslandServerData>();
  const relatedRecords: TRelatedCoreDataRecords = await fetchRelatedRecords(
    serverData.island.coreDataId,
  );

  const geoJSON = toFeatureCollection([serverData.place]);

  return { ...serverData, ...relatedRecords, geoJSON };
};

clientLoader.hydrate = true;

export const HydrateFallback = () => {
  return <Loading />;
};

const IslandPage = () => {
  const { island, wpData, place, geoJSON, maps, ...related } =
    useLoaderData<TIslandClientData>();
  console.log(
    "🚀 ~ IslandPage ~ island, wpData, place, geoJSON, maps, ...related:",
    island,
    wpData,
    place,
    geoJSON,
    maps,
    related,
  );
  const [map, setMap] = useState<TMap | undefined>(undefined);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const topRef = useRef<HTMLDivElement>(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "idle") topRef.current?.scrollIntoView();
  }, [navigation]);

  useEffect(() => {
    if (!mapLoaded || !map || !geoJSON || map.getLayer(`${island.id}-fill`))
      return;

    // const layers = map.getStyle().layers;
    // Find the index of the first symbol layer in the map style
    // let firstSymbolId;
    // for (let i = 0; i < layers.length; i++) {
    //   if (layers[i].type === "symbol") {
    //     firstSymbolId = layers[i].id;
    //     break;
    //   }
    // }
    const firstSymbolId = map
      .getStyle()
      .layers.find((layer) => layer.type === "symbol")?.id;

    map.addSource(island.id, {
      type: "geojson",
      data: geoJSON,
    });

    map.addLayer(
      {
        id: `${island.id}-fill`,
        type: "fill",
        source: island.id,
        layout: {},
        paint: {
          "fill-color": "blue",
          "fill-opacity": 0.25,
        },
        filter: ["==", "$type", "Polygon"],
      },
      firstSymbolId,
    );

    map.addLayer({
      id: `${island.id}-outline`,
      type: "line",
      source: island.id,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "blue",
        "line-width": 2,
        "line-opacity": 0.5,
      },
      filter: ["==", "$type", "Polygon"],
    });

    // for (const labelLayer of map
    //   .getStyle()
    //   .layers.filter((layer) => layer.id.includes("label"))) {
    //   console.log("🚀 ~ .layers.filter ~ layer:", labelLayer.id);

    //   map.moveLayer(`${island.id}-outline`, labelLayer.id);
    // }

    if (map.getLayer("clusters")) {
      map.moveLayer(`${island.id}-outline`, "clusters");
    }

    const bounds = new LngLatBounds(
      bbox(geoJSON) as [number, number, number, number],
    );

    map.fitBounds(bounds, { padding: 100 });

    return () => {
      try {
        if (!map) return;
        for (const layer of activeLayers) {
          if (map.getLayer(layer)) map.removeLayer(layer);
        }
        if (map.getLayer(`${island.id}-fill`))
          map.removeLayer(`${island.id}-fill`);
        if (map.getLayer(`${island.id}-outline`))
          map.removeLayer(`${island.id}-outline`);
        if (map.getSource(island.id)) map.removeSource(island.id);
      } catch {}
    };
  }, [map, mapLoaded, geoJSON, island]);

  return (
    <MapContext.Provider value={{ map, setMap, mapLoaded, setMapLoaded }}>
      <PlaceContext.Provider
        value={{
          place: island,
          activeLayers,
          setActiveLayers,
        }}
      >
        <div
          className={`flex flex-row overflow-hidden h-[calc(100vh-${topBarHeight})]`}
        >
          <div className="w-full md:w-1/2 overflow-scroll pb-32">
            <div className="flex flex-col">
              <h1 className="text-2xl px-4 pt-4 sticky top-0 bg-white z-10">
                {island.label} Island
              </h1>
              <div ref={topRef} className="relative -top-12 z-10 min-h-10">
                <FeaturedMedium record={related} />
              </div>
              <div
                className="relative px-4 -mt-12 primary-content"
                dangerouslySetInnerHTML={{
                  __html: wpData?.content.rendered ?? place.description,
                }}
              />
            </div>
            {related.places?.relatedPlaces && (
              <RelatedPlaces places={related.places.relatedPlaces} />
            )}
            {related.items?.videos && (
              <RelatedVideos videos={related.items.videos} />
            )}
            {related.media_contents?.photographs && (
              <RelatedPhotographs manifest={place.iiif_manifest} />
            )}
          </div>
          <div className="hidden md:block w-1/2">
            <ClientOnly>
              {() => (
                <Map>
                  <MapSwitcher>
                    {related.places?.topoQuads && (
                      <>
                        {related.places?.topoQuads.map((quad) => {
                          return (
                            <TopoQuads key={quad.uuid} quadId={quad.uuid} />
                          );
                        })}
                      </>
                    )}
                  </MapSwitcher>
                </Map>
              )}
            </ClientOnly>
          </div>
        </div>
      </PlaceContext.Provider>
    </MapContext.Provider>
  );
};

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    return <RouteError error={error} />;
  } else if (error instanceof Error) {
    return <CodeError error={error} />;
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export default IslandPage;
