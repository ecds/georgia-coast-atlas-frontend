import { LngLatBounds } from "maplibre-gl";
import { bbox } from "@turf/turf";
import { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import { islands, dataHosts } from "~/config.ts";
import { fetchPlaceRecord, fetchRelatedRecords } from "~/data/coredata";
import Map from "~/components/Map.client";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import RelatedPlaces from "~/components/RelatedPlaces";
import FeaturedMedium from "~/components/FeaturedMedium";
import RelatedVideos from "~/components/RelatedVideos";
import { IslandContext } from "~/contexts";
import type {
  TCoreDataPlace,
  TWordPressData,
  TIslandServerData,
  TIslandClientData,
  TRelatedCoreDataRecords,
} from "~/types";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import type { Map as TMap } from "maplibre-gl";
import RelatedPhotographs from "~/components/RelatedPhotographs";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const island = islands.find((i) => params.island == `${i.slug}-island`);

  if (!island) return { wpData: null, place: null };

  const cdData: TCoreDataPlace = await fetchPlaceRecord(island?.coreDataId);

  return { place: cdData?.place, island } || null;
};

export const clientLoader = async ({
  params,
  serverLoader,
}: ClientLoaderFunctionArgs) => {
  const serverData = await serverLoader<TIslandServerData>();
  const relatedRecords: TRelatedCoreDataRecords = await fetchRelatedRecords(
    serverData.island.coreDataId,
  );
  const wpResponse = await fetch(
    `https://${dataHosts.wordPress}/wp-json/wp/v2/pages/?slug=${params.island}`,
  );

  const wpData: TWordPressData[] = await wpResponse.json();

  const geoJSON = toFeatureCollection([serverData.place]);

  return { ...serverData, ...relatedRecords, wpData: wpData[0], geoJSON };
};

clientLoader.hydrate = true;

const IslandPage = () => {
  const { island, wpData, place, geoJSON, ...related } =
    useLoaderData<TIslandClientData>();
  const [map, setMap] = useState<TMap | undefined>(undefined);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const topRef = useRef<HTMLDivElement>(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "idle") topRef.current?.scrollIntoView();
  }, [navigation]);

  useEffect(() => {
    if (!mapLoaded || !map || !geoJSON) return;

    const layers = map.getStyle().layers;
    // Find the index of the first symbol layer in the map style
    let firstSymbolId;
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].type === "symbol") {
        firstSymbolId = layers[i].id;
        break;
      }
    }

    map.addSource("island", {
      type: "geojson",
      data: geoJSON,
    });

    map.addLayer(
      {
        id: "fill",
        type: "fill",
        source: "island",
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
      id: "outline",
      type: "line",
      source: "island",
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
        if (map.getLayer("fill")) map.removeLayer("fill");
        if (map.getLayer("outline")) map.removeLayer("outline");
        if (map.getSource("island")) map.removeSource("island");
      } catch {}
    };
  }, [map, mapLoaded, geoJSON]);

  return (
    <IslandContext.Provider
      value={{
        map,
        setMap,
        mapLoaded,
        setMapLoaded,
      }}
    >
      <div className="flex flex-row overflow-hidden h-[calc(100vh-5rem)]">
        <div className="w-1/2 overflow-scroll pb-32">
          <div className="flex flex-col">
            <h1 className="text-2xl px-4 pt-4 sticky top-0 bg-white z-10">
              {island.label} Island
            </h1>
            <div ref={topRef} className="relative -top-12 z-50 bg-black">
              <FeaturedMedium record={related} />
            </div>
            <div
              className="relative px-4 -mt-12"
              dangerouslySetInnerHTML={{
                __html: wpData?.content.rendered,
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
        <div className="w-1/2">
          <ClientOnly>
            {() => (
              <Map map={map} setMap={setMap} setMapLoaded={setMapLoaded} />
            )}
          </ClientOnly>
        </div>
      </div>
    </IslandContext.Provider>
  );
};

export default IslandPage;
