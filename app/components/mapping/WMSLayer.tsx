import { useContext, useEffect, useState } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import type { AddLayerObject, SourceSpecification } from "maplibre-gl";
import AddLayerButton from "./AddLayerButton";
import LayerOpacity from "./LayerOpacity";
import {
  PlaceLayerBody,
  PlaceLayerContainer,
  PlaceLayerTitle,
} from "../relatedRecords/PlaceLayerContainer";
import type { ESMapLayer } from "~/esTypes";

interface Props {
  placeLayer: ESMapLayer;
}

const WMSLayer = ({ placeLayer }: Props) => {
  const { map } = useContext(MapContext);
  const { activeLayers, place, setActiveLayers } = useContext(PlaceContext);
  const [opacity, setOpacity] = useState<number>(100);

  useEffect(() => {
    if (!map) return;

    const source: SourceSpecification = {
      type: "raster",
      tiles: [placeLayer.wms_resource],
      tileSize: 256,
    };

    const layer: AddLayerObject = {
      id: placeLayer.uuid,
      source: placeLayer.uuid,
      type: "raster",
      paint: {
        "raster-opacity": 0,
      },
    };

    map.addSource(placeLayer.uuid, source);
    if (map.getLayer(`clusters-${place.uuid}`)) {
      map.addLayer(layer, `clusters-${place.uuid}`);
    } else {
      map.addLayer(layer);
    }

    return () => {
      map.removeLayer(placeLayer.uuid);
      map.removeSource(placeLayer.uuid);
    };
  }, [map, placeLayer, place]);

  useEffect(() => {
    if (
      activeLayers?.includes(placeLayer.uuid) &&
      map &&
      map.getLayer(placeLayer.uuid)
    ) {
      map.moveLayer(placeLayer.uuid, `clusters-${place.uuid}`);
      map.setPaintProperty(placeLayer.uuid, "raster-opacity", opacity * 0.01);
    } else {
      map?.setPaintProperty(placeLayer.uuid, "raster-opacity", 0);
    }
  }, [activeLayers, map, placeLayer, opacity, place]);

  const handleClick = () => {
    if (!activeLayers || !setActiveLayers) return;
    if (activeLayers.includes(placeLayer.uuid)) {
      setActiveLayers(
        activeLayers.filter((layer) => layer !== placeLayer.uuid)
      );
    } else {
      setActiveLayers([...activeLayers, placeLayer.uuid]);
    }
  };

  const handleOpacityChange = (newValue: string) => {
    setOpacity(parseInt(newValue));
  };

  if (place) {
    const active = activeLayers?.includes(placeLayer.uuid);
    return (
      <PlaceLayerContainer key={placeLayer.uuid}>
        <AddLayerButton onClick={handleClick} image={placeLayer.preview}>
          {active ? "remove" : "add"}
        </AddLayerButton>
        <PlaceLayerBody>
          <PlaceLayerTitle>{placeLayer.name}</PlaceLayerTitle>
          <LayerOpacity
            id={placeLayer.uuid}
            opacity={opacity}
            handleChange={handleOpacityChange}
            disabled={!active}
          />
        </PlaceLayerBody>
      </PlaceLayerContainer>
    );
  }

  return null;
};

export default WMSLayer;
