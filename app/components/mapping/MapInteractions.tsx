import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { MapContext, PlaceContext } from "~/contexts";
import { full } from "~/mapStyles/full";
import type { MapLayerMouseEvent } from "maplibre-gl";
import type { ESPlace } from "~/esTypes";

const MapInteractions = () => {
  const { map, mapLoaded } = useContext(MapContext);
  const { place, setHoveredPlace, setClickedPlace } = useContext(PlaceContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!map || !mapLoaded) return;

    const handleMouseEnter = async ({
      features,
      lngLat,
    }: MapLayerMouseEvent) => {
      if (!features) return;

      map.getCanvas().style.cursor = "pointer";

      setHoveredPlace({
        ...features[0].properties,
        location: { lon: lngLat.lng, lat: lngLat.lat },
      } as ESPlace);
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
      setHoveredPlace(undefined);
    };

    const handleClick = ({ features }: MapLayerMouseEvent) => {
      if (!features || !features[0].properties.slug) return;

      setClickedPlace(features[0].properties.slug);
    };

    const layers = full.layers
      .filter((layer) => layer.id.startsWith("gca-"))
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
  }, [map, navigate, setHoveredPlace, mapLoaded, location, setClickedPlace]);

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
