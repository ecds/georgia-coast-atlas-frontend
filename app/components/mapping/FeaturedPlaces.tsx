import { useCallback, useContext, useEffect, useRef, useState } from "react";
import PlacePopup from "~/components/mapping/PlacePopup.client";
import { MapContext, PlaceContext } from "~/contexts";
import { ClientOnly } from "remix-utils/client-only";
import { Link } from "@remix-run/react";
import { masks } from "~/mapStyles";
import PlaceTooltip from "./PlaceTooltip";
import { booleanWithin, point } from "@turf/turf";
import type { MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl";
import type { ESPlace, TLonLat } from "~/esTypes";
import type { Geometry } from "geojson";

interface Props {
  places: ESPlace[];
  sourceName: string;
}

const islandStyleLayer = masks.layers.find(
  (layer) => layer.id === "simpleIslandsFill"
);

const countyStyleLayer = masks.layers.find(
  (layer) => layer.id === "simpleCounties"
);

const FeaturedPlaces = ({ places, sourceName }: Props) => {
  const { map, mapLoaded } = useContext(MapContext);
  const { hoveredPlace, setHoveredPlace } = useContext(PlaceContext);
  const hoveredId = useRef<string | undefined>(undefined);
  const [activeIsland, setActiveIsland] = useState<ESPlace | undefined>(
    undefined
  );
  const [location, setLocation] = useState<TLonLat | undefined>(undefined);
  const hoveredGeometry = useRef<Geometry | undefined>(undefined);

  const handleMouseMove = useCallback(
    ({
      features,
      lngLat,
    }: MapMouseEvent & { features?: MapGeoJSONFeature[] }) => {
      setLocation({ lon: lngLat.lng, lat: lngLat.lat });
      if (map && mapLoaded) {
        map.getCanvas().style.cursor = "pointer";
        if (features && features.length > 0) {
          const feature = features[0];
          hoveredGeometry.current = feature.geometry;
          setHoveredPlace(places.find((place) => place.uuid === feature.id));
        }
      }
    },
    [map, mapLoaded, places, setHoveredPlace]
  );

  const handleMouseLeave = useCallback(
    ({ lngLat }: MapMouseEvent) => {
      if (
        hoveredGeometry.current &&
        !booleanWithin(point(Object.values(lngLat)), hoveredGeometry.current)
      ) {
        if (map) {
          map.getCanvas().style.cursor = "";
          setHoveredPlace(undefined);
          setLocation(undefined);
          hoveredGeometry.current = undefined;
        }
      }
    },
    [map, setHoveredPlace]
  );

  const handleClick = useCallback(
    (
      event: MapMouseEvent & {
        features?: MapGeoJSONFeature[];
      }
    ) => {
      if (!map && !event.features) return;
      const clickedIsland = places.find((island) => {
        if (event.features)
          return island.name === event.features[0].properties.name;
        return undefined;
      });
      setHoveredPlace(undefined);
      setLocation(undefined);
      setActiveIsland(clickedIsland);
    },
    [map, places, setHoveredPlace]
  );

  useEffect(() => {
    const sourceLayer =
      sourceName == "islands" ? islandStyleLayer : countyStyleLayer;

    if (!map || !mapLoaded || !sourceLayer || !map.getLayer(sourceLayer.id))
      return;

    map.on("mousemove", sourceLayer.id, handleMouseMove);
    map.on("mouseleave", sourceLayer.id, handleMouseLeave);
    map.on("click", sourceLayer.id, handleClick);

    return () => {
      map.off("mousemove", sourceLayer.id, handleMouseMove);
      map.off("mouseleave", sourceLayer.id, handleMouseLeave);
      map.off("click", sourceLayer.id, handleClick);
    };
  }, [
    map,
    mapLoaded,
    handleClick,
    handleMouseMove,
    handleMouseLeave,
    sourceName,
  ]);

  useEffect(() => {
    // if (hoveredPlace) setActiveIsland(undefined);
    if (!map) return;
    if (hoveredId.current && hoveredId.current !== hoveredPlace?.uuid) {
      map.setFeatureState(
        { source: sourceName, id: hoveredId.current },
        { hovered: false }
      );
      hoveredId.current = undefined;
    }

    if (hoveredPlace) {
      map.setFeatureState(
        { source: sourceName, id: hoveredPlace.uuid },
        { hovered: true }
      );
      hoveredId.current = hoveredPlace.uuid;
    } else {
      hoveredId.current = undefined;
    }
  }, [map, hoveredPlace, sourceName]);

  return (
    <>
      {places.map((place) => {
        return (
          <ClientOnly key={`popup-${place.uuid}`}>
            {() => (
              <>
                <PlacePopup
                  show={activeIsland == place}
                  location={place.location}
                  onClose={() => setActiveIsland(undefined)}
                  zoomToFeature={false}
                >
                  {place.featured_photograph && (
                    <img
                      src={place.featured_photograph.replace("max", "600,")}
                      alt=""
                    />
                  )}
                  <h4 className="text-xl ">{place.name}</h4>
                  <p>{place.short_description}</p>
                  <Link
                    to={`/places/${place.slug}`}
                    className="text-blue-700 underline underline-offset-2 text-l block mt-2"
                  >
                    Explore
                  </Link>
                </PlacePopup>
                <PlaceTooltip
                  show={hoveredPlace == place}
                  location={location ?? place.location}
                  onClose={() => setActiveIsland(undefined)}
                  zoomToFeature={false}
                  // anchor={sourceName === "islands" ? "left" : "right"}
                >
                  <h4 className="text-white">{place.name}</h4>
                </PlaceTooltip>
              </>
            )}
          </ClientOnly>
        );
      })}
    </>
  );
};

export default FeaturedPlaces;
