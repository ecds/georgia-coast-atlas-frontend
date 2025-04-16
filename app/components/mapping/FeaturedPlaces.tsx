import { useCallback, useContext, useEffect, useRef, useState } from "react";
import PlacePopup from "~/components/mapping/PlacePopup.client";
import { MapContext, PlaceContext } from "~/contexts";
import { ClientOnly } from "remix-utils/client-only";
import { Link } from "@remix-run/react";
import { countiesLayerId, islandsLayerId, areasSourceId } from "~/mapStyles";
import PlaceTooltip from "./PlaceTooltip";
import { booleanWithin, point } from "@turf/turf";
import type { MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl";
import type { ESPlace, TLonLat } from "~/esTypes";
import type { Geometry } from "geojson";

interface Props {
  places: ESPlace[];
}

const FeaturedPlaces = ({ places }: Props) => {
  const { map, mapLoaded } = useContext(MapContext);
  const { hoveredPlace, setHoveredPlace, activePlace, setActivePlace } =
    useContext(PlaceContext);
  const [location, setLocation] = useState<TLonLat | undefined>(undefined);
  const [currentZoom, setCurrentZoom] = useState<number>(0);
  const hoveredId = useRef<string | undefined>(undefined);
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
      } else {
        setHoveredPlace(undefined);
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
      setActivePlace(clickedIsland);
    },
    [map, places, setHoveredPlace, setActivePlace]
  );

  useEffect(() => {
    const updateZoom = () => {
      if (!map) return;
      setCurrentZoom(map.getZoom());
    };

    const clearLocation = () => {
      setLocation(undefined);
    };

    if (!map) return;

    for (const layer of [islandsLayerId, countiesLayerId]) {
      map.on("mousemove", layer, handleMouseMove);
      map.on("mouseleave", layer, handleMouseLeave);
      map.on("click", layer, handleClick);
    }
    map.on("zoomend", updateZoom);
    map.on("mouseout", clearLocation);

    return () => {
      for (const layer of [islandsLayerId, countiesLayerId]) {
        map.off("mousemove", layer, handleMouseMove);
        map.off("mouseleave", layer, handleMouseLeave);
        map.off("click", layer, handleClick);
      }
      for (const place of places) {
        map.setFeatureState(
          { source: areasSourceId, id: place.uuid },
          { hovered: false }
        );
      }
      map.off("zoomend", updateZoom);
      map.off("mouseout", clearLocation);
    };
  }, [map, mapLoaded, handleClick, handleMouseMove, handleMouseLeave, places]);

  useEffect(() => {
    // if (hoveredPlace) setActivePlace(undefined);
    if (!map) return;
    if (hoveredId.current && hoveredId.current !== hoveredPlace?.uuid) {
      map.setFeatureState(
        { source: areasSourceId, id: hoveredId.current },
        { hovered: false }
      );
      hoveredId.current = undefined;
    }

    if (hoveredPlace) {
      map.setFeatureState(
        { source: areasSourceId, id: hoveredPlace.uuid },
        { hovered: true }
      );
      hoveredId.current = hoveredPlace.uuid;
    } else {
      hoveredId.current = undefined;
      map.removeFeatureState({ source: areasSourceId });
    }
  }, [map, hoveredPlace]);

  useEffect(() => {
    console.log("🚀 ~ FeaturedPlaces ~ activePlace:", activePlace);
    if (activePlace) setHoveredPlace(undefined);
  }, [activePlace, setHoveredPlace]);

  if (map) {
    return (
      <>
        {places.map((place) => {
          return (
            <ClientOnly key={`popup-${place.uuid}`}>
              {() => (
                <>
                  <PlacePopup
                    show={activePlace == place}
                    location={place.location}
                    onClose={() => setActivePlace(undefined)}
                    zoomToFeature={false}
                    anchor={
                      place.types.includes("Barrier Island")
                        ? "right"
                        : undefined
                    }
                  >
                    {place.featured_photograph && (
                      <img
                        src={place.featured_photograph.replace("max", "400,")}
                        alt=""
                        className="h-40 w-auto"
                      />
                    )}
                    <h4 className="text-xl ">{place.name}</h4>
                    <p>{place.short_description}</p>
                    <Link
                      state={{ title: "Explore", slug: "explore" }}
                      to={`/places/${place.slug}`}
                      className="text-blue-700 underline underline-offset-2 text-l block mt-2"
                    >
                      Explore
                    </Link>
                  </PlacePopup>
                  <PlaceTooltip
                    show={hoveredPlace == place && activePlace !== hoveredPlace}
                    className={currentZoom < 12 ? "text-lg" : "text-xs"}
                    location={location ?? place.location}
                    onClose={() => {
                      setActivePlace(undefined);
                      setHoveredPlace(undefined);
                    }}
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
  }

  return null;
};

export default FeaturedPlaces;
