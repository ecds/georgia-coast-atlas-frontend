import chroma from "chroma-js";
import { useContext, useEffect } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import { landColors } from "~/mapStyles";
import { pulsingDot } from "~/utils/pulsingDot";
import { LngLatBounds, type AddLayerObject } from "maplibre-gl";
import { getColor } from "~/utils/toFeatureCollection";

const PlaceMap = () => {
  const { place } = useContext(PlaceContext);
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map || !place || !place.geojson) return;

    const sourceId = `place-${place.uuid}`;

    map.addSource(`${sourceId}-shape`, {
      type: "geojson",
      data: place.geojson,
      promoteId: "uuid",
    });

    map.addSource(`${sourceId}-point`, {
      type: "geojson",
      data: place.geojson,
      promoteId: "uuid",
      cluster: true,
    });

    map.addImage(
      "pulsing-dot",
      pulsingDot({
        map,
        color: getColor(place.types[0]) ?? landColors.road,
      }),
      { pixelRatio: 2 }
    );

    const layers: AddLayerObject[] = [];
    place.geojson.features.map((feature) => {
      switch (feature.geometry.type) {
        case "LineString":
          layers.push({
            id: `${sourceId}-line`,
            source: `${sourceId}-shape`,
            type: "line",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": landColors.accent,
              "line-width": [
                "interpolate",
                ["exponential", 1.2],
                ["zoom"],
                5,
                1,
                17,
                4,
              ],
            },
          });
          break;
        case "Polygon":
          layers.push({
            id: `${sourceId}-poly-fill`,
            type: "fill",
            source: `${sourceId}-shape`,
            layout: {},
            paint: {
              "fill-color": chroma(landColors.water).brighten(1).hex(),
              "fill-opacity": 1,
            },
          });
          layers.push({
            id: `${sourceId}-poly-line`,
            type: "line",
            source: `${sourceId}-shape`,
            layout: {},
            paint: {
              "line-color": landColors.accent,
              "line-width": [
                "interpolate",
                ["exponential", 1.2],
                ["zoom"],
                5,
                1,
                17,
                4,
              ],
            },
          });
          break;
        case "Point":
          layers.push({
            id: `${sourceId}-point`,
            source: `${sourceId}-point`,
            type: "symbol",
            layout: { "icon-image": "pulsing-dot" },
          });
          break;
      }
    });

    for (const layer of layers) {
      map.addLayer(layer as AddLayerObject);
    }

    const bounds = new LngLatBounds(place.bbox);

    map.fitBounds(bounds, { maxZoom: 13 });

    return () => {
      for (const layer of layers.flat()) {
        map.removeLayer(layer.id);
      }
      map.removeImage("pulsing-dot");
      map.removeSource(`${sourceId}-point`);
      map.removeSource(`${sourceId}-shape`);
    };
  }, [place, map]);

  return <></>;
};

export default PlaceMap;
