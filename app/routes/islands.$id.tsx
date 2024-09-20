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
import RelatedPlaces from "~/components/relatedRecords/RelatedPlaces";
import FeaturedMedium from "~/components/FeaturedMedium";
import RelatedVideos from "~/components/relatedRecords/RelatedVideos";
import { PlaceContext, MapContext } from "~/contexts";
import RelatedPhotographs from "~/components/relatedRecords/RelatedPhotographs";
import MapSwitcher from "~/components/MapSwitcher";
import TopoQuads from "~/components/mapping/TopoQuads";
import RouteError from "~/components/errorResponses/RouteError";
import CodeError from "~/components/errorResponses/CodeError";
import Loading from "~/components/layout/Loading";
import type {
  TPlaceRecord,
  TWordPressData,
  TIslandServerData,
  TIslandClientData,
  TRelatedCoreDataRecords,
  TActiveLayer,
} from "~/types";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import type { Map as TMap } from "maplibre-gl";
import RelatedMapLayers from "~/components/relatedRecords/RelatedMapLayers";
import RelatedTopoQuads from "~/components/relatedRecords/RelatedTopoQuads";

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
  const [map, setMap] = useState<TMap | undefined>(undefined);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [topoQuads, setTopoQuads] = useState<TPlaceRecord[]>([]);
  const [mapLayers, setMapLayers] = useState<TPlaceRecord[]>([]);
  const [activeLayers, setActiveLayers] = useState<TActiveLayer>({});
  const topRef = useRef<HTMLDivElement>(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "idle") topRef.current?.scrollIntoView();
    if (navigation.state === "loading") {
      // setActiveLayers({});
      if (map?.getLayer(`${island.id}-outline`))
        map.removeLayer(`${island.id}-outline`);
      if (map?.getLayer(`${island.id}-fill`))
        map.removeLayer(`${island.id}-fill`);
    }
  }, [navigation, island, map]);

  useEffect(() => {
    if (!mapLoaded || !map || !geoJSON || map.getLayer(`${island.id}-fill`))
      return;

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
          topoQuads,
          setTopoQuads,
          setMapLayers,
        }}
      >
        <div
          className={`flex flex-row overflow-hidden h-[calc(100vh-${topBarHeight})]`}
        >
          <div className="w-full md:w-1/2 lg:w-2/5 overflow-scroll pb-32">
            <div className="flex flex-col">
              <h1 className="text-2xl px-4 pt-4 sticky top-0 z-10 bg-white">
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
            {related.places?.mapLayers && (
              <RelatedMapLayers layers={related.places.mapLayers} />
            )}
            {related.places?.topoQuads && (
              <RelatedTopoQuads quads={related.places.topoQuads} />
            )}
          </div>
          <div className="hidden md:block w-1/2 lg:w-3/5">
            <ClientOnly>
              {() => (
                <Map>
                  <MapSwitcher>
                    {mapLayers && (
                      <>
                        {mapLayers.map((layer) => {
                          return (
                            <button
                              key={`layer-switcher-${layer.uuid}`}
                              className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${layer.id in activeLayers ? "bg-gray-200" : ""}`}
                              role="menuitem"
                              onClick={() =>
                                setActiveLayers({
                                  ...activeLayers,
                                  [layer.uuid]: layer.place_layers[0],
                                })
                              }
                            >
                              {layer.name}
                            </button>
                          );
                        })}
                      </>
                    )}
                    <div className="border-t-2 pt-2">
                      <span className="px-4 inline">Topo Quads</span>
                      {topoQuads && (
                        <>
                          {topoQuads.map((quad) => {
                            return <TopoQuads key={quad.uuid} quad={quad} />;
                          })}
                        </>
                      )}
                    </div>
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
