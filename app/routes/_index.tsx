import { useContext, useState, useEffect, useCallback } from "react";
import { MapContext } from "~/contexts";
import { useLoaderData } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import Map from "~/components/Map.client";
import { islands } from "~/config";
import { fetchPlaceRecord } from "~/data/coredata";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import type { FeatureCollection } from "geojson";
import type { TPlaceRecord } from "~/types";
import type { LoaderFunction } from "@remix-run/node";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import IntroModal from "~/components/layout/IntroModal";
import MapSwitcher from "~/components/MapSwitcher";

export const loader: LoaderFunction = async () => {
  const islandDataPromises = islands.map((island) =>
    fetchPlaceRecord(island.coreDataId)
      .then((data) => data)
      .catch(() => undefined),
  );

  const islandData = await Promise.all(islandDataPromises);
  const validIslandData: TPlaceRecord[] = islandData.filter(
    (data): data is TPlaceRecord => data !== undefined,
  );
  const geoJSON = toFeatureCollection(validIslandData);

  return { geoJSON };
};

export default function Index() {
  const [map, setMap] = useState<maplibregl.Map | undefined>(undefined);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true); // Modal state
  const { geoJSON } = useLoaderData<{ geoJSON: FeatureCollection }>();

  const handleMouseEnter = useCallback(() => {
    if (map) map.getCanvas().style.cursor = "pointer";
  }, [map]);

  const handleMouseLeave = useCallback(() => {
    if (map) map.getCanvas().style.cursor = "";
  }, [map]);

  const handleClick = useCallback(
    (
      e: maplibregl.MapMouseEvent & {
        features?: maplibregl.MapGeoJSONFeature[];
      },
    ) => {
      if (!map) return;
      if (e.features && e.features.length > 0) {
        const coordinates = e.lngLat;
        const name = e.features[0].properties?.name;

        while (Math.abs(e.lngLat.lng - coordinates.lng) > 180) {
          coordinates.lng += e.lngLat.lng > coordinates.lng ? 360 : -360;
        }

        new maplibregl.Popup().setLngLat(coordinates).setHTML(name).addTo(map);
      }
    },
    [map],
  );

  useEffect(() => {
    if (!map || !mapLoaded || !geoJSON) return;

    if (map.getSource("islands")) return;

    map.addSource("islands", {
      type: "geojson",
      data: geoJSON,
    });

    map.addLayer({
      id: "islands-fill",
      type: "fill",
      source: "islands",
      layout: {},
      paint: {
        "fill-color": "blue",
        "fill-opacity": 0.25,
      },
    });

    map.addLayer({
      id: "islands-outline",
      type: "line",
      source: "islands",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "blue",
        "line-width": 2,
        "line-opacity": 0.5,
      },
    });

    map.on("mouseenter", "islands-fill", handleMouseEnter);
    map.on("mouseleave", "islands-fill", handleMouseLeave);
    map.on("click", "islands-fill", handleClick);

    return () => {
      if (map.getLayer("islands-fill")) map.removeLayer("islands-fill");
      if (map.getLayer("islands-outline")) map.removeLayer("islands-outline");
      if (map.getSource("islands")) map.removeSource("islands");
      map.off("mouseenter", "islands-fill", handleMouseEnter);
      map.off("mouseleave", "islands-fill", handleMouseLeave);
      map.off("click", "islands-fill", handleClick);
    };
  }, [
    map,
    mapLoaded,
    geoJSON,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
  ]);

  return (
    <MapContext.Provider
      value={{
        map,
        setMap,
        mapLoaded,
        setMapLoaded,
      }}
    >
      <div className="w-full h-full">
        {isModalOpen && <IntroModal setIsOpen={setIsModalOpen} />}{" "}
        {/* Render the modal */}
        <ClientOnly>
          {() => (
            <Map>
              <MapSwitcher />
            </Map>
          )}
        </ClientOnly>
      </div>
    </MapContext.Provider>
  );
}
