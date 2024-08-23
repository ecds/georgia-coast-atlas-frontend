import { LngLatBounds } from "maplibre-gl";
import { bbox } from "@turf/turf";
import { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import { islands, dataHosts, topBarHeight, modelFieldUUIDs } from "~/config.ts";
import { fetchPlaceRecord, fetchRelatedRecords } from "~/data/coredata";
import Map from "~/components/Map.client";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import RelatedPlaces from "~/components/RelatedPlaces";
import FeaturedMedium from "~/components/FeaturedMedium";
import RelatedVideos from "~/components/RelatedVideos";
import { PlaceContext } from "~/contexts";
import type {
  TWordPressData,
  TIslandServerData,
  TIslandClientData,
  TRelatedCoreDataRecords,
} from "~/types";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import type { Map as TMap } from "maplibre-gl";
import RelatedPhotographs from "~/components/RelatedPhotographs";
import MapSwitcher from "~/components/MapSwitcher";
import TopoQuads from "~/components/mapping/TopoQuads";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const island = islands.find((i) => params.island == `${i.slug}-island`);

  if (!island) return { wpData: null, place: null };

  const place = await fetchPlaceRecord(island?.coreDataId);
  const wpResponse = await fetch(
    `https://${dataHosts.wordPress}/wp-json/wp/v2/pages/?slug=${params.island}`,
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

const IslandPage = () => {
  const { island, wpData, place, geoJSON, maps, ...related } =
    useLoaderData<TIslandClientData>();
  console.log("🚀 ~ IslandPage ~ place:", place);
  const [map, setMap] = useState<TMap | undefined>(undefined);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const topRef = useRef<HTMLDivElement>(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "idle") topRef.current?.scrollIntoView();
  }, [navigation]);

  useEffect(() => {
    if (!mapLoaded || !map || !geoJSON || map.getLayer(`${island.slug}-fill`))
      return;

    const layers = map.getStyle().layers;
    // Find the index of the first symbol layer in the map style
    let firstSymbolId;
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].type === "symbol") {
        firstSymbolId = layers[i].id;
        break;
      }
    }

    map.addSource(island.slug, {
      type: "geojson",
      data: geoJSON,
    });

    map.addLayer(
      {
        id: `${island.slug}-fill`,
        type: "fill",
        source: island.slug,
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
      id: `${island.slug}-outline`,
      type: "line",
      source: island.slug,
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
        if (map.getLayer(`${island.slug}-fill`))
          map.removeLayer(`${island.slug}-fill`);
        if (map.getLayer(`${island.slug}-outline`))
          map.removeLayer(`${island.slug}-outline`);
        if (map.getSource(island.slug)) map.removeSource(island.slug);
      } catch {}
    };
  }, [map, mapLoaded, geoJSON, island]);

  return (
    <PlaceContext.Provider
      value={{
        map,
        setMap,
        mapLoaded,
        setMapLoaded,
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
            <div ref={topRef} className="relative -top-12 z-50 min-h-10">
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
            // @ts-ignore
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
                        return <TopoQuads key={quad.uuid} quadId={quad.uuid} />;
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
  );
};

export default IslandPage;
