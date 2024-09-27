import { useContext, useEffect } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import { bbox } from "@turf/turf";
import { LngLatBounds } from "maplibre-gl";
import type { AddLayerObject, SourceSpecification } from "maplibre-gl";

const PlaceGeoJSON = () => {
  const { map } = useContext(MapContext);
  const { place, geoJSON, setLayerSources, setActiveLayers, activeLayers } =
    useContext(PlaceContext);

  useEffect(() => {
    if (!map) return;
    const activeRasters = activeLayers.length > 0;
    if (map.getLayer(`${place.id}-fill`)) {
      map.setPaintProperty(
        `${place.id}-fill`,
        "fill-opacity",
        activeRasters ? 0 : 0.25,
      );
    }
    if (map.getLayer(`${place.id}-outline`)) {
      map.setPaintProperty(
        `${place.id}-outline`,
        "line-opacity",
        activeRasters ? 0 : 0.5,
      );
    }
  }, [map, place, activeLayers]);

  useEffect(() => {
    if (!map || !place || !geoJSON) return;

    const firstSymbolId = map
      .getStyle()
      .layers.find((layer) => layer.type === "symbol")?.id;

    const placeSource: SourceSpecification = {
      type: "geojson",
      data: geoJSON,
    };

    if (!map.getSource(`${place.id}`)) {
      map.addSource(place.id, placeSource);
    }

    const fillLayer: AddLayerObject = {
      id: `${place.id}-fill`,
      type: "fill",
      source: place.id,
      layout: {},
      paint: {
        "fill-color": "blue",
        "fill-opacity": 0.25,
      },
      filter: ["==", "$type", "Polygon"],
    };

    if (!map.getLayer(fillLayer.id)) {
      map.addLayer(fillLayer, firstSymbolId);
    }

    const outlineLayer: AddLayerObject = {
      id: `${place.id}-outline`,
      type: "line",
      source: place.id,
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
    };

    if (!map.getLayer(outlineLayer.id)) {
      map.addLayer(outlineLayer);
    }

    if (map.getLayer(`${place.id}-clusters`)) {
      map.moveLayer(outlineLayer.id, `${place.id}-clusters`);
    }

    const bounds = new LngLatBounds(
      bbox(geoJSON) as [number, number, number, number],
    );

    map.fitBounds(bounds, { padding: 100 });
    setLayerSources((layerSources) => {
      return { ...layerSources, [place.id]: placeSource };
    });

    return () => {
      try {
        if (!map) return;
        if (map.getLayer(`${place.id}-fill`))
          map.removeLayer(`${place.id}-fill`);
        if (map.getLayer(`${place.id}-outline`))
          map.removeLayer(`${place.id}-outline`);
        if (map.getSource(place.id)) map.removeSource(place.id);
      } catch {}
    };
  }, [map, place, setActiveLayers, setLayerSources, geoJSON]);
  return null;
};

export default PlaceGeoJSON;
