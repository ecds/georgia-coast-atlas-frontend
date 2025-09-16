import { useContext, useEffect, useState } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import { LngLatBounds } from "maplibre-gl";
import AddLayerButton from "./AddLayerButton";
import LayerOpacity from "./LayerOpacity";
import {
  PlaceLayerBody,
  PlaceLayerContainer,
  PlaceLayerTitle,
} from "../relatedRecords/PlaceLayerContainer";
import { wmsLayer } from "~/mapStyles";
import type { ESMapItem } from "~/esTypes";

interface Props {
  placeLayer: ESMapItem;
}

const WMSLayer = ({ placeLayer }: Props) => {
  const { map } = useContext(MapContext);
  const { activeLayers, place, setActiveLayers } = useContext(PlaceContext);
  const [opacity, setOpacity] = useState<number>(100);

  useEffect(() => {
    if (!map) return;

    for (const [index, resource] of placeLayer.wms_resources.entries()) {
      const id = `${placeLayer.uuid}-${index}`;
      const { source, layer } = wmsLayer({
        url: resource,
        id,
        initialOpacity: 0,
      });

      map.addSource(id, source);
      map.addLayer(layer);
    }

    return () => {
      for (const index in placeLayer.wms_resources) {
        const id = `${placeLayer.uuid}-${index}`;
        map.removeLayer(id);
        map.removeSource(id);
      }
    };
  }, [map, placeLayer, place]);

  useEffect(() => {
    if (activeLayers?.includes(placeLayer.uuid) && map) {
      map.fitBounds(new LngLatBounds(placeLayer.bbox), { padding: 50 });
    }
  }, [activeLayers, placeLayer, map]);

  useEffect(() => {
    if (activeLayers?.includes(placeLayer.uuid) && map) {
      for (const index in placeLayer.wms_resources) {
        const id = `${placeLayer.uuid}-${index}`;
        map.setPaintProperty(id, "raster-opacity", opacity * 0.01);
        map.setLayoutProperty(id, "visibility", "visible");
      }
    } else {
      for (const index in placeLayer.wms_resources) {
        const id = `${placeLayer.uuid}-${index}`;
        map?.setPaintProperty(id, "raster-opacity", 0);
        map?.setLayoutProperty(id, "visibility", "none");
      }
    }
  }, [activeLayers, map, placeLayer, opacity]);

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
        <AddLayerButton onClick={handleClick} image={placeLayer.thumbnail_url}>
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
