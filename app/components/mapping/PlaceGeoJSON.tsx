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
    if (map.getLayer(`${place.uuid}-fill`)) {
      map.setPaintProperty(
        `${place.uuid}-fill`,
        "fill-opacity",
        activeRasters ? 0 : 0.25
      );
    }
    if (map.getLayer(`${place.uuid}-outline`)) {
      map.setPaintProperty(
        `${place.uuid}-outline`,
        "line-opacity",
        activeRasters ? 0 : 0.5
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

    if (!map.getSource(`${place.uuid}`)) {
      map.addSource(place.uuid, placeSource);
    }

    const fillLayer: AddLayerObject = {
      id: `${place.uuid}-fill`,
      type: "fill",
      source: place.uuid,
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
      id: `${place.uuid}-outline`,
      type: "line",
      source: place.uuid,
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

    if (map.getLayer(`${place.uuid}-clusters`)) {
      map.moveLayer(outlineLayer.id, `${place.uuid}-clusters`);
    }

    const bounds = new LngLatBounds(
      bbox(geoJSON) as [number, number, number, number]
    );

    map.fitBounds(bounds, { padding: 100 });
    setLayerSources((layerSources) => {
      return { ...layerSources, [place.uuid]: placeSource };
    });

    return () => {
      try {
        if (!map) return;
        if (map.getLayer(`${place.uuid}-fill`))
          map.removeLayer(`${place.uuid}-fill`);
        if (map.getLayer(`${place.uuid}-outline`))
          map.removeLayer(`${place.uuid}-outline`);
        if (map.getSource(place.uuid)) map.removeSource(place.uuid);
      } catch {}
    };
  }, [map, place, setActiveLayers, setLayerSources, geoJSON]);
  return null;
};

export default PlaceGeoJSON;
