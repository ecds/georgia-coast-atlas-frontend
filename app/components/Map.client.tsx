import maplibregl from "maplibre-gl";
import { useEffect, useState } from "react";
import { bbox } from "@turf/turf";
import { pulsingDot } from "~/utils/pulsingDot";
import type { FeatureCollection } from "geojson";

interface Props {
  geoJSON: FeatureCollection;
}

const Map = ({ geoJSON }: Props) => {
  const [map, setMap] = useState<maplibregl.Map | undefined>(undefined);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  useEffect(() => {
    const _map = new maplibregl.Map({
      container: "mapContainer",
      style:
        "https://api.maptiler.com/maps/streets/style.json?key=uXfXuebPlkoPXiY3TPcv",
      center: [-81.1067, 31.8375],
      zoom: 10,
    });

    setMap(_map);

    return () => {
      if (_map) _map.remove();
    };
  }, []);

  useEffect(() => {
    if (!map) return;
    map.on("load", async () => {
      setMapLoaded(true);
    });
  }, [map, geoJSON]);

  useEffect(() => {
    if (!mapLoaded || !map || !geoJSON) return;

    const bounds = new maplibregl.LngLatBounds(
      bbox(geoJSON) as [number, number, number, number],
    );

    map.fitBounds(bounds, { padding: 100 });

    if (!map.getImage("pulsing-dot"))
      map.addImage("pulsing-dot", pulsingDot(map), { pixelRatio: 2 });

    map.addSource("places", {
      type: "geojson",
      data: geoJSON,
    });

    map.addLayer({
      id: "place",
      type: "fill",
      source: "places",
      layout: {},
      paint: {
        "fill-color": "blue",
        "fill-opacity": 0.25,
      },
      filter: ["==", "$type", "Polygon"],
    });

    map.addLayer({
      id: "outline",
      type: "line",
      source: "places",
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

    map.addLayer({
      id: "related-places",
      type: "symbol",
      source: "places",
      layout: {
        "icon-image": "pulsing-dot",
      },
      filter: ["==", "$type", "Point"],
    });

    return () => {
      try {
        if (!map) return;
        if (map.getImage("pulsing-dot")) map.removeImage("pulsing-dot");
        if (map.getLayer("place")) map.removeLayer("place");
        if (map.getLayer("outline")) map.removeLayer("outline");
        if (map.getLayer("related-places")) map.removeLayer("related-places");
        if (map.getSource("places")) map.removeSource("places");
      } catch {}
    };
  }, [map, mapLoaded, geoJSON]);

  return <div id="mapContainer" className="h-[calc(100vh-5rem)]"></div>;
};

export default Map;
