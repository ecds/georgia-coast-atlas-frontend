import { WarpedMapLayer } from "@allmaps/maplibre";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigation } from "@remix-run/react";
import { MapContext, PlaceContext } from "~/contexts";
import { fetchPlaceRecord, fetchRelatedRecord } from "~/data/coredata";
import type {
  TCoreDataImage,
  TPlaceRecord,
  TRelatedPlaceRecord,
} from "~/types";
import type { Dispatch, SetStateAction } from "react";
import type { AddLayerObject } from "maplibre-gl";

interface Props {
  layer: TRelatedPlaceRecord;
  setGroup: Dispatch<SetStateAction<TPlaceRecord[]>>;
  showThumbnails?: boolean;
}

const PlaceLayers = ({ layer, setGroup, showThumbnails = true }: Props) => {
  const navigation = useNavigation();
  const { map } = useContext(MapContext);
  const { activeLayers, place, setActiveLayers } = useContext(PlaceContext);
  const [placeRecord, setPlaceRecord] = useState<TPlaceRecord>();
  const [thumbnails, setThumbnails] = useState<TCoreDataImage[]>([]);
  const layerRef = useRef<WarpedMapLayer | AddLayerObject>();

  const orderLayers = useCallback(() => {
    if (map && layerRef.current && map.getLayer(layerRef.current.id)) {
      if (map.getLayer(`${place.id}-fill`)) map.moveLayer(`${place.id}-fill`);
      if (map.getLayer(`${place.id}-outline`))
        map.moveLayer(`${place.id}-outline`);
      if (map.getLayer(`clusters`)) map.moveLayer(`clusters`);
      if (map.getLayer(`cluster-count`)) map.moveLayer(`cluster-count`);
      if (map.getLayer(`unclustered-point`)) map.moveLayer(`unclustered-point`);
      if (map.getLayer(`${place.id}-fill`))
        map.moveLayer(layerRef.current.id, `${place.id}-fill`);
    }
  }, [map, place]);

  useEffect(() => {
    if (navigation.state === "loading" && layerRef.current) {
      if (map?.getLayer(layerRef.current.id)) {
        if (layerRef.current instanceof WarpedMapLayer) {
          console.log(
            "🚀 ~ useEffect ~ layerRef.current: CLEARING",
            layerRef.current,
          );
          layerRef.current.clear();
          map.removeLayer(layerRef.current.id);
        } else {
          map.removeLayer(layerRef.current.id);
          if (map.getSource(layerRef.current.id)) {
            map.removeLayer(layerRef.current.id);
            map.removeSource(layerRef.current.id);
          }
        }
      }
      if (placeRecord)
        setGroup((layers) => {
          return layers.map((layer) => layer.uuid).includes(placeRecord.uuid)
            ? layers.filter((layer) => layer.uuid !== placeRecord.uuid)
            : [...layers, placeRecord];
        });
      layerRef.current = undefined;
    }
  }, [navigation, map, placeRecord, setGroup]);

  useEffect(() => {
    if (!layer) return;

    let ignore = false;

    const fetchLayerRecord = async () => {
      const record = await fetchPlaceRecord(layer.uuid);
      if (record && !ignore) {
        setPlaceRecord(record);

        setGroup((layers) => {
          if (layers.map((l) => l.uuid).includes(record.uuid)) {
            return layers;
          }
          return [...layers, record];
        });
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
      setGroup([]);
    };
  }, [layer, showThumbnails, setGroup]);

  // useEffect(() => {
  //   removeFromGroup();
  // }, [removeFromGroup, placeRecord]);

  useEffect(() => {
    if (!map || !placeRecord) return;

    switch (placeRecord.place_layers[0].layer_type) {
      case "georeference":
        layerRef.current = new WarpedMapLayer(placeRecord.uuid);
        if (!map.getLayer(placeRecord.uuid) && layerRef.current)
          map.addLayer(layerRef.current);
        break;
      case "raster":
        if (!map.getSource(placeRecord.uuid))
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
        break;
      default:
        break;
    }
  }, [map, placeRecord]);

  useMemo(() => {
    if (!map || !layerRef.current) return;

    if (layerRef.current.id in activeLayers) {
      if (!map.getLayer(layerRef.current.id)) map.addLayer(layerRef.current);

      if (layerRef.current.type == "raster") {
        orderLayers();
      } else if ("addGeoreferenceAnnotationByUrl" in layerRef.current) {
        const currentLayers = Array.from(
          layerRef.current.getWarpedMapList().warpedMapsById.keys(),
        );
        if (
          currentLayers.length === 0 &&
          !currentLayers
            .map((u) => u.split("//")[1])
            .includes(activeLayers[layerRef.current.id].url.split("//")[1])
        )
          map.on("allrequestedtilesloaded", () => {
            orderLayers();
          });
        layerRef.current.clear();
        layerRef.current.addGeoreferenceAnnotationByUrl(
          activeLayers[layerRef.current.id].url,
        );
      }
    } else {
      if (map.getLayer(layerRef.current.id))
        map.removeLayer(layerRef.current.id);
    }
  }, [map, activeLayers, orderLayers]);

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

  if (placeRecord) {
    return (
      <>
        {thumbnails?.map((thumbNail) => {
          return (
            <button key={thumbNail.uuid} onClick={handleClick}>
              <figure className="md:m-8 max-w-xs">
                <img
                  src={thumbNail.content_thumbnail_url}
                  alt=""
                  className="drop-shadow-md h-auto md:h-32 w-full md:w-auto mx-auto"
                />
                <figcaption className="pt-2 md:max-w-32">
                  {thumbNail.name}
                </figcaption>
              </figure>
            </button>
          );
        })}
      </>
    );
  }

  return null;
};

export default PlaceLayers;
