import { useContext, useEffect, useRef, useState } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import { fetchPlaceRecord, fetchRelatedRecord } from "~/data/coredata";
import { orderLayers } from "~/utils/orderMaps";
import type {
  TCoreDataImage,
  TPlaceRecord,
  TRelatedPlaceRecord,
} from "~/types";
import type { AddLayerObject } from "maplibre-gl";
import { bbox } from "@turf/turf";
import AddLayerButton from "./AddLayerButton";
import LayerOpacity from "./LayerOpacity";
import {
  PlaceLayerBody,
  PlaceLayerContainer,
  PlaceLayerTitle,
} from "../relatedRecords/PlaceLayerContainer";

interface Props {
  placeLayer: TRelatedPlaceRecord;
}

const WMSLayer = ({ placeLayer }: Props) => {
  const { map } = useContext(MapContext);
  const { activeLayers, place, setActiveLayers } = useContext(PlaceContext);
  const [placeRecord, setPlaceRecord] = useState<TPlaceRecord>();
  const [thumbnails, setThumbnails] = useState<TCoreDataImage[]>([]);
  const [opacity, setOpacity] = useState<number>(100);
  const [active, setActive] = useState<boolean>(false);
  const layerRef = useRef<AddLayerObject>();

  useEffect(() => {
    setActive(Boolean(activeLayers.includes(placeLayer.uuid)));
  }, [activeLayers, placeLayer, placeRecord]);

  useEffect(() => {
    if (!placeLayer) return;

    let ignore = false;

    const fetchLayerRecord = async () => {
      const record = await fetchPlaceRecord(placeLayer.uuid);
      if (record && !ignore) {
        setPlaceRecord(record);
      }
    };

    const fetchRelatedMediaRecord = async () => {
      const record = await fetchRelatedRecord(
        placeLayer.uuid,
        "media_contents",
      );
      if (record && !ignore) setThumbnails(record.media_contents);
    };

    fetchLayerRecord();
    fetchRelatedMediaRecord();

    return () => {
      ignore = true;
      setPlaceRecord(undefined);
    };
  }, [placeLayer]);

  useEffect(() => {
    if (!map || !placeRecord) return;

    layerRef.current = {
      id: placeRecord.uuid,
      type: "raster",
      source: placeRecord.uuid,
      paint: {},
    };

    if (!map.getSource(placeRecord.uuid)) {
      map.addSource(placeRecord.uuid, {
        type: "raster",
        tiles: placeRecord.place_layers.map((layer) => layer.url),
        tileSize: 256,
      });
    }

    return () => {
      if (map?.getLayer(placeRecord.uuid)) map.removeLayer(placeRecord.uuid);
      if (map.getSource(placeRecord.uuid)) map.removeSource(placeRecord.uuid);
    };
  }, [map, placeRecord, active]);

  useEffect(() => {
    if (active && placeRecord && map?.getLayer(placeRecord.uuid)) {
      map?.setPaintProperty(placeRecord.uuid, "raster-opacity", opacity * 0.01);
    }
  }, [map, opacity, activeLayers, active, placeRecord]);

  useEffect(() => {
    if (!map || !placeRecord) return;

    if (active && placeRecord) {
      if (map && layerRef.current && !map.getLayer(placeRecord.uuid)) {
        map.addLayer(layerRef.current);
        const layerBounds = bbox(placeLayer.place_geometry.geometry_json);
        const newBounds = map
          .getBounds()
          .extend(layerBounds as [number, number, number, number]);
        map.fitBounds(newBounds, { padding: 20 });
      }

      if (layerRef.current?.type == "raster") {
        orderLayers(map, place.id);
      }
    } else {
      if (map.getLayer(placeRecord.uuid)) map.removeLayer(placeRecord.uuid);
    }
  }, [map, active, place, placeLayer, placeRecord]);

  const handleClick = () => {
    if (placeRecord) {
      if (activeLayers.includes(placeRecord.uuid)) {
        setActiveLayers(
          activeLayers.filter((layer) => layer !== placeRecord.uuid),
        );
      } else {
        setActiveLayers([...activeLayers, placeRecord.uuid]);
      }
    }
  };

  const handleOpacityChange = (newValue: string) => {
    setOpacity(parseInt(newValue));
  };

  if (placeRecord) {
    return (
      <>
        {thumbnails?.map((thumbNail) => {
          return (
            <PlaceLayerContainer key={thumbNail.uuid}>
              <AddLayerButton
                onClick={handleClick}
                image={thumbNail.content_thumbnail_url}
              >
                {active ? "remove" : "add"}
              </AddLayerButton>
              <PlaceLayerBody>
                <PlaceLayerTitle>{thumbNail.name}</PlaceLayerTitle>
                <LayerOpacity
                  id={placeLayer.uuid}
                  opacity={opacity}
                  handleChange={handleOpacityChange}
                  disabled={!active}
                />
              </PlaceLayerBody>
            </PlaceLayerContainer>
          );
        })}
      </>
    );
  }

  return null;
};

export default WMSLayer;
