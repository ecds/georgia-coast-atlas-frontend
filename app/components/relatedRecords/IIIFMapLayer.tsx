import { WarpedMapLayer } from "@allmaps/maplibre";
import { useContext, useEffect, useRef, useState } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import { orderLayers } from "~/utils/orderMaps";
import LayerOpacity from "./LayerOpacity";
import type { Map } from "maplibre-gl";
import type { TCoreDataLayer } from "~/types";
import AddLayerButton from "./AddLayerButton";
import {
  PlaceLayerBody,
  PlaceLayerContainer,
  PlaceLayerTitle,
} from "./PlaceLayerContainer";

interface Props {
  layer: TCoreDataLayer;
  show: boolean;
  onClick: () => void;
}

const IIIFMapLayer = ({ layer, show, onClick }: Props) => {
  console.log("🚀 ~ IIIFMapLayer ~ layer:", layer);
  const { map, mapLoaded } = useContext(MapContext);
  const { place } = useContext(PlaceContext);
  const [opacity, setOpacity] = useState<number>(100);
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
    const addLayer = async () => {
      if (!layerRef.current || !map) return;
      await layerRef.current.addGeoreferenceAnnotationByUrl(
        `https://dev.georgiacoastatlas.org/iiif/annotation-geo/${layer.name}/${layer.placeName?.replaceAll(" ", "_") ?? ""}`,
      );

      const currentBounds = map.getBounds();
      const imageBounds = layerRef.current.getBounds();
      if (imageBounds)
        map.fitBounds(currentBounds.extend(imageBounds), { padding: 20 });
    };

    const clearLayer = () => {
      if (mapRef.current && layerRef.current) {
        if (layerRef.current.renderer) layerRef.current.clear();
        if (mapRef.current.getLayer(layerRef.current.id))
          mapRef.current.removeLayer(layerRef.current.id);
      }
    };

    if (mapRef.current && show && layerRef.current && loaded.current) {
      if (!mapRef.current.getLayer(layerRef.current.id)) {
        mapRef.current.addLayer(layerRef.current);
        mapRef.current.on("allrequestedtilesloaded", () => {
          if (mapRef.current && layerRef.current)
            orderLayers(mapRef.current, layerRef.current.id, place.id);
        });
      }
      addLayer();
    }

    if (!show) clearLayer();

    return () => {
      clearLayer();
    };
  }, [show, layer, place, map]);

  useEffect(() => {
    if (layerRef.current?.renderer) layerRef.current.setOpacity(opacity * 0.01);
  }, [opacity]);

  const handleOpacityChange = (newValue: string) => {
    setOpacity(parseInt(newValue));
  };

  return (
    <PlaceLayerContainer>
      <AddLayerButton
        onClick={onClick}
        // className="md:mx-8 w-32 drop-shadow-md h-auto md:h-32 mx-auto bg-cover flex items-end rounded-md"
        image={`https://iip.readux.io/iiif/3/topos/${layer.name}/${layer.placeName?.replaceAll(" ", "_")}.tiff/square/200,/0/default.jpg`}
      >
        {show ? "remove" : "add"}
      </AddLayerButton>
      <PlaceLayerBody>
        <PlaceLayerTitle>{layer.placeName}</PlaceLayerTitle>
        <LayerOpacity
          id={layer.id}
          opacity={opacity}
          handleChange={handleOpacityChange}
          disabled={!show}
        />
      </PlaceLayerBody>
    </PlaceLayerContainer>
  );
};

export default IIIFMapLayer;
