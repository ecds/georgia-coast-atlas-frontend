import { useContext, useEffect, useRef } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import { singlePoint } from "~/mapStyles/geoJSON";
import { LngLat, LngLatBounds, Marker } from "maplibre-gl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import type { AddLayerObject, SourceSpecification } from "maplibre-gl";
import { bbox, destination, distance } from "@turf/turf";

const PlaceHighlight = () => {
  const { place } = useContext(PlaceContext);
  const { map, activeStyle } = useContext(MapContext);
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!place || !map) return;

    const placeSource: SourceSpecification = {
      type: "geojson",
      data: place.geojson,
    };

    map.addSource("place-source", placeSource);

    let marker = undefined;

    if (markerRef.current) {
      const location = new LngLat(place.location.lon, place.location.lat);
      marker = new Marker({ element: markerRef.current })
        .setLngLat(location)
        .addTo(map);

      const lineOrPoly = place.geojson.features
        .map((feature) => feature.geometry.type.toLowerCase())
        .some((type) => type.includes("poly") || type.includes("line"));

      // if (lineOrPoly) {
      const bounds = new LngLatBounds(
        bbox(place.geojson) as [number, number, number, number]
      );

      const se = bounds.getSouthEast();
      const sw = bounds.getSouthWest();
      console.log(
        "🚀 ~ PlaceHighlight ~ bounds.getSouthWest();:",
        bounds.getSouthWest()
      );
      const width = distance([se.lng, se.lat], [sw.lng, sw.lat]);
      const offset = destination([sw.lng, sw.lat], width / 2, -90);
      bounds.extend(offset.geometry.coordinates as [number, number]);
      console.log(
        "🚀 ~ PlaceHighlight ~ bounds.getSouthWest();:",
        bounds.getSouthWest()
      );
      console.log(
        "🚀 ~ PlaceHighlight ~ offset:",
        [sw.lng, sw.lat],
        width,
        offset.geometry.coordinates
      );

      // Extend bounds to offset for content pane.
      // map.once("moveend", () =>
      //   map.fitBounds(bounds.extend(map.unproject([0, 0])), {
      //     padding: 50,
      //     speed: 0.5,
      //   })
      // );

      map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 13,
        speed: 0.5,
        offset: [16, 0],
      });
      // } else {
      //   map.easeTo({ center: location });
      //   console.log("🚀 ~ PlaceHighlight ~ location:", location);
      // }

      const iconElement = markerRef.current.firstChild as HTMLElement;

      iconElement.classList.add("animate-bounce");

      setTimeout(() => {
        iconElement.classList.remove("animate-bounce");
      }, 1500);
    }

    const placePoint = singlePoint(`${place.slug}-point`, "place-source", 0);

    const layers: AddLayerObject[] = [];
    place.geojson.features.map((feature) => {
      switch (feature.geometry.type) {
        case "LineString":
        case "MultiLineString":
          layers.push({
            id: `${place.slug}-line`,
            source: "place-source",
            type: "line",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "hsl(209, 86%, 56%)",
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
        case "MultiPolygon":
          layers.push({
            id: `${place.slug}-poly-fill`,
            type: "fill",
            source: "place-source",
            layout: {},
            paint: {
              "fill-outline-color": "hsl(357, 96%, 58%)",
              "fill-opacity": 0,
            },
          });
          layers.push({
            id: `${place.slug}-poly-line`,
            type: "line",
            source: "place-source",
            layout: {},
            paint: {
              "line-color": "hsl(357, 96%, 58%)",
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
      }
    });

    for (const layer of layers) {
      map.addLayer(layer as AddLayerObject, "county-boundary-label");
    }

    map.addLayer(placePoint);

    return () => {
      if (map.getLayer(`${place.slug}-point`))
        map.removeLayer(`${place.slug}-point`);
      if (marker) marker.remove();
      for (const layer of layers) {
        if (map.getLayer(layer.id)) map.removeLayer(layer.id);
      }
      if (map.getSource("place-source")) map.removeSource("place-source");
    };
  }, [place, map, activeStyle]);

  return (
    <span ref={markerRef}>
      <FontAwesomeIcon
        icon={faLocationDot}
        className="z-50 text-xl w-12 h-12 text-red-500 drop-shadow-2xl"
      />
    </span>
  );
};

export default PlaceHighlight;
