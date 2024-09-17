import { WarpedMapLayer } from "@allmaps/maplibre";
import { useContext, useEffect, useRef } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import { orderLayers } from "~/utils/orderMaps";
import type { Map } from "maplibre-gl";
import type { TCoreDataLayer } from "~/types";

interface Props {
  layer: TCoreDataLayer;
  show: boolean;
}

const IIIFMapLayer = ({ layer, show }: Props) => {
  const { map, mapLoaded } = useContext(MapContext);
  const { place } = useContext(PlaceContext);
  const loaded = useRef<boolean>(false);
  const layerRef = useRef<WarpedMapLayer>();
  const mapRef = useRef<Map>();

  useEffect(() => {
    if (!mapLoaded || !map || !layer || loaded.current) return;
    mapRef.current = map;
    layerRef.current = new WarpedMapLayer(layer.id);

    loaded.current = true;

    return () => {
      loaded.current = false;
    };
  }, [mapLoaded, map, layer]);

  useEffect(() => {
    if (mapRef.current && show && layerRef.current && loaded.current) {
      if (!mapRef.current.getLayer(layerRef.current.id)) {
        mapRef.current.addLayer(layerRef.current);
        mapRef.current.on("allrequestedtilesloaded", () => {
          if (mapRef.current && layerRef.current)
            orderLayers(mapRef.current, layerRef.current.id, place.id);
        });
      }

      layerRef.current.addGeoreferenceAnnotationByUrl(
        `http://localhost:3000/iiif/annotation-geo/${layer.name}/${layer.placeName?.replace(" ", "_") ?? ""}`,
      );
    }

    if (
      mapRef.current &&
      !show &&
      layerRef.current &&
      mapRef.current.getLayer(layerRef.current.id)
    ) {
      try {
        layerRef.current.clear();
      } catch {}
      mapRef.current.removeLayer(layerRef.current.id);
    }
  }, [show, layer, place]);

  return <></>;
};

export default IIIFMapLayer;
