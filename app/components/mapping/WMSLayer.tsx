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
import AddLayerButton from "../relatedRecords/AddLayerButton";
import LayerOpacity from "../relatedRecords/LayerOpacity";
import {
  PlaceLayerBody,
  PlaceLayerContainer,
  PlaceLayerTitle,
} from "../relatedRecords/PlaceLayerContainer";

interface Props {
  layer: TRelatedPlaceRecord;
}

const WMSLayer = ({ layer }: Props) => {
  const { map } = useContext(MapContext);
  const { activeLayers, place, setActiveLayers } = useContext(PlaceContext);
  const [placeRecord, setPlaceRecord] = useState<TPlaceRecord>();
  const [thumbnails, setThumbnails] = useState<TCoreDataImage[]>([]);
  const [opacity, setOpacity] = useState<number>(100);
  const [active, setActive] = useState<boolean>(false);
  const layerRef = useRef<AddLayerObject>();

  useEffect(() => {
    setActive(Boolean(layerRef.current && layerRef.current.id in activeLayers));
  }, [activeLayers]);

  useEffect(() => {
    if (!layer) return;

    let ignore = false;

    const fetchLayerRecord = async () => {
      const record = await fetchPlaceRecord(layer.uuid);
      if (record && !ignore) {
        setPlaceRecord(record);
      }
    };

    const fetchRelatedMediaRecord = async () => {
      const record = await fetchRelatedRecord(layer.uuid, "media_contents");
      if (record && !ignore) setThumbnails(record.media_contents);
    };

    fetchLayerRecord();
    fetchRelatedMediaRecord();

    return () => {
      ignore = true;
      setPlaceRecord(undefined);
    };
  }, [layer]);

  useEffect(() => {
    if (!map || !placeRecord) return;

    if (!map.getSource(placeRecord.uuid)) {
      map.addSource(placeRecord.uuid, {
        type: "raster",
        tiles: placeRecord.place_layers.map((layer) => layer.url),
        tileSize: 256,
      });
      layerRef.current = {
        id: placeRecord.uuid,
        type: "raster",
        source: placeRecord.uuid,
        paint: {},
      };
    }

    return () => {
      if (!layerRef.current) return;
      if (map?.getLayer(layerRef.current.id))
        map.removeLayer(layerRef.current.id);
      if (map.getSource(layerRef.current.id))
        map.removeSource(layerRef.current.id);
      layerRef.current = undefined;
    };
  }, [map, placeRecord]);

  useEffect(() => {
    if (layerRef.current && active && map?.getLayer(layerRef.current.id)) {
      map?.setPaintProperty(
        layerRef.current.id,
        "raster-opacity",
        opacity * 0.01,
      );
    }
    console.log("🚀 ~ WMSLayer ~ opacity:", opacity);
  }, [map, opacity, activeLayers, active]);

  useEffect(() => {
    if (!map || !layerRef.current) return;

    if (layerRef.current.id in activeLayers) {
      if (map && !map.getLayer(layerRef.current.id)) {
        map.addLayer(layerRef.current);
        const layerBounds = bbox(layer.place_geometry.geometry_json);
        const newBounds = map
          .getBounds()
          .extend(layerBounds as [number, number, number, number]);
        map.fitBounds(newBounds, { padding: 20 });
      }

      if (layerRef.current.type == "raster") {
        orderLayers(map, layerRef.current.id, place.id);
      }
    } else {
      if (map.getLayer(layerRef.current.id))
        map.removeLayer(layerRef.current.id);
    }
  }, [map, activeLayers, place, layer]);

  const handleClick = () => {
    if (placeRecord) {
      if (placeRecord.uuid in activeLayers) {
        const newObj = Object.fromEntries(
          Object.entries(activeLayers).filter(
            ([key]) => key !== placeRecord.uuid,
          ),
        );
        setActiveLayers(newObj);
      } else {
        setActiveLayers({
          ...activeLayers,
          [placeRecord.uuid]: placeRecord.place_layers[0],
        });
      }
    }
  };

  const handleOpacityChange = (newValue: string) => {
    console.log("🚀 ~ handleOpacityChange ~ newValue:", newValue);
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
                  id={layer.uuid}
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
