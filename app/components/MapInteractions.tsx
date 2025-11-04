import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { MapContext, PlaceContext } from "~/contexts";
import { full } from "~/mapStyles/full";
import type { MapLayerMouseEvent } from "maplibre-gl";

const MapInteractions = () => {
  const { map } = useContext(MapContext);
  const { place, setHoveredPlace } = useContext(PlaceContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!map) return;
    const handleMouseEnter = async ({
      features,
      lngLat,
    }: MapLayerMouseEvent) => {
      console.log("🚀 ~ handleMouseEnter ~ lngLat:", lngLat);
      map.getCanvas().style.cursor = "pointer";
      setHoveredPlace({
        ...features[0].properties,
        location: { lon: lngLat.lng, lat: lngLat.lat },
      });
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
      setHoveredPlace(undefined);
    };

    const handleClick = ({ features, lngLat }: MapLayerMouseEvent) => {
      if (!features) return;

      for (const feature of features) {
        console.log("🚀 ~ handleClick ~ feature:", feature);
        // map.setFilter(feature.layer.id, [
        //   "all",
        //   ["!=", "uuid", feature.properties.uuid],
        //   ["==", "type", "Point"],
        // ]);
      }

      navigate(`/places/${features[0].properties.slug}`);
    };

    const layers = full.layers
      .filter((layer) => layer.source === "gca")
      .map((layer) => layer.id);

    for (const layer of layers) {
      map.on("click", layer, handleClick);
      map.on("mousemove", layer, handleMouseEnter);
      map.on("mouseleave", layer, handleMouseLeave);
    }

    return () => {
      for (const layer of layers) {
        map.off("click", layer, handleClick);
        map.off("mousemove", layer, handleMouseEnter);
        map.off("mouseleave", layer, handleMouseLeave);
      }
    };
  }, [map, navigate]);

  useEffect(() => {
    if (!place || !map) return;

    for (const type of place.types) {
      const layerId = `gca-${type.toLowerCase().replaceAll(" ", "")}`;
      map.setFilter(layerId, [
        "all",
        ["!=", "uuid", place.uuid],
        ["==", "$type", "Point"],
      ]);
    }

    return () => {
      for (const type of place.types) {
        const layerId = `gca-${type.toLowerCase().replaceAll(" ", "")}`;
        map.setFilter(layerId, ["all", ["==", "$type", "Point"]]);
      }
    };
  }, [place, map]);

  return <></>;
};

export default MapInteractions;
