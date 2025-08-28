import { WarpedMapLayer } from "@allmaps/maplibre";
import { useContext, useEffect, useRef, useState } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import LayerOpacity from "./LayerOpacity";
import type { Map } from "maplibre-gl";
import AddLayerButton from "./AddLayerButton";
import {
  PlaceLayerBody,
  PlaceLayerContainer,
  PlaceLayerTitle,
} from "~/components/relatedRecords/PlaceLayerContainer";
import type { ESTopoLayer } from "~/esTypes";

interface Props {
  layer: ESTopoLayer;
  year: string;
  show: boolean;
  onClick: () => void;
}

const IIIFMapLayer = ({ layer, year, show, onClick }: Props) => {
  const { map, mapLoaded } = useContext(MapContext);
  const { place, setActiveLayers } = useContext(PlaceContext);
  const [opacity, setOpacity] = useState<number>(100);
  const loaded = useRef<boolean>(false);
  const layerRef = useRef<WarpedMapLayer>(new WarpedMapLayer());
  const mapRef = useRef<Map>();

  useEffect(() => {
    if (!mapLoaded || !map || !layer || loaded.current) return;
    mapRef.current = map;
    layerRef.current = new WarpedMapLayer(layer.url);

    loaded.current = true;

    return () => {
      loaded.current = false;
    };
  }, [mapLoaded, map, layer]);

  useEffect(() => {
    const addWarpedLayer = async (beforeLayer: string | undefined) => {
      if (!layerRef.current || !layerRef.current.renderer || !map) return;
      console.log(
        "🚀 ~ addWarpedLayer ~ beforeLayer:",
        beforeLayer,
        layerRef.current.id
      );
      await layerRef.current.addGeoreferenceAnnotationByUrl(
        `/iiif/annotation-geo/${year}/${layer.name?.replaceAll(" ", "_") ?? ""}`
      );
      if (setActiveLayers)
        setActiveLayers((activeLayers) => [
          ...activeLayers,
          layerRef.current.id,
        ]);

      if (beforeLayer) map.moveLayer(layerRef.current.id, beforeLayer);
      const currentBounds = map.getBounds();
      const imageBounds = layerRef.current.getBounds();
      if (imageBounds) map.fitBounds(currentBounds.extend(imageBounds));
    };

    if (!place) return;

    const clearLayer = () => {
      if (mapRef.current && layerRef.current) {
        if (layerRef.current.renderer) layerRef.current.clear();
        if (mapRef.current.getLayer(layerRef.current.id))
          mapRef.current.removeLayer(layerRef.current.id);
      }
    };

    const beforeLayer = map?.getLayer(`clusters-${place.uuid}`)
      ? `clusters-${place.uuid}`
      : undefined;

    if (mapRef.current && show && layerRef.current && loaded.current) {
      if (!mapRef.current.getLayer(layerRef.current.id)) {
        // @ts-expect-error: WarpedMapLayer is a valid type.
        mapRef.current.addLayer(layerRef.current, beforeLayer);
      }
      addWarpedLayer(beforeLayer);
    }

    if (!show) clearLayer();

    return () => {
      clearLayer();
    };
  }, [show, layer, place, map, setActiveLayers, year]);

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
        image={`https://iip.ecds.io/iiif/3/topos/${year}/${layer.name?.replaceAll(" ", "_")}.tiff/square/200,/0/default.jpg`}
      >
        {show ? "remove" : "add"}
      </AddLayerButton>
      <PlaceLayerBody>
        <PlaceLayerTitle>{layer.name}</PlaceLayerTitle>
        <LayerOpacity
          id={layer.uuid}
          opacity={opacity}
          handleChange={handleOpacityChange}
          disabled={!show}
        />
      </PlaceLayerBody>
    </PlaceLayerContainer>
  );
};

export default IIIFMapLayer;
