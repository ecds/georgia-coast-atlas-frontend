import { useContext, useEffect } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import { bbox } from "@turf/turf";
import { LngLatBounds } from "maplibre-gl";
import type { AddLayerObject, SourceSpecification } from "maplibre-gl";

const PlaceGeoJSON = () => {
  const { map } = useContext(MapContext);
  const { place, activeLayers, geoJSON, setGeoJSONSources, setGeoJSONLayers } =
    useContext(PlaceContext);

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
        "fill-opacity": activeLayers.length > 0 ? 0 : 0.25,
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
    if (setGeoJSONSources)
      setGeoJSONSources((geoJSONSources) => {
        return { ...geoJSONSources, [place.id]: placeSource };
      });
    if (setGeoJSONLayers)
      setGeoJSONLayers((geoJSONLayers) => {
        const newLayers = [fillLayer, outlineLayer];
        let layersToAdd: AddLayerObject[] = [];
        for (const newLayer of newLayers) {
          layersToAdd = [
            ...layersToAdd.filter((l) => l.id !== newLayer.id),
            newLayer,
          ];
          if (!geoJSONLayers.map((layer) => layer.id).includes(newLayer.id))
            layersToAdd.push(newLayer);
        }
        return [
          ...geoJSONLayers.filter(
            (l) => !layersToAdd.map((a) => a.id).includes(l.id),
          ),
          ...layersToAdd,
        ];
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
  }, [map, place, setGeoJSONLayers, setGeoJSONSources, activeLayers, geoJSON]);
  return null;
};

export default PlaceGeoJSON;
