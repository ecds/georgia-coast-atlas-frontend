import { useCallback, useContext, useEffect, useRef, useState } from "react";
import PlacePopup from "~/components/mapping/PlacePopup";
import { MapContext, PlaceContext } from "~/contexts";
import ClientOnly from "~/components/ClientOnly";
import { Link } from "react-router";
import { countiesLayerId, islandsLayerId, areasSourceId } from "~/mapStyles";
import PlaceTooltip from "./PlaceTooltip";
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
      if (activePlace || !map) return;
      setLocation({ lon: lngLat.lng, lat: lngLat.lat });
      map.getCanvas().style.cursor = "pointer";
      if (features && features.length > 0) {
        const feature = features[0];
        hoveredGeometry.current = feature.geometry;
        setHoveredPlace(places.find((place) => place.uuid === feature.id));
      }
    },
    [map, places, setHoveredPlace, activePlace]
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
      if (map) map.getCanvas().style.cursor = "";
    };

    const handleMouseOverWater = () => {
      setHoveredPlace(undefined);
    };

    if (!map) return;

    for (const layer of [countiesLayerId, islandsLayerId]) {
      map.on("mousemove", layer, handleMouseMove);
      map.on("click", layer, handleClick);
      map.on("mouseleave", layer, clearLocation);
    }
    map.on("zoomend", updateZoom);
    map.on("mouseout", clearLocation);
    map.on("mousemove", "water", handleMouseOverWater);

    return () => {
      for (const layer of [islandsLayerId, countiesLayerId]) {
        map.off("mousemove", layer, handleMouseMove);
        map.off("click", layer, handleClick);
        map.off("mouseleave", layer, clearLocation);
      }
      map.off("mousemove", "water", handleMouseOverWater);
      for (const place of places) {
        map.setFeatureState(
          { source: areasSourceId, sourceLayer: areasSourceId, id: place.uuid },
          { hovered: false }
        );
      }
      map.off("zoomend", updateZoom);
      map.off("mouseout", clearLocation);
    };
  }, [map, mapLoaded, handleClick, handleMouseMove, places, setHoveredPlace]);

  useEffect(() => {
    // if (hoveredPlace) setActivePlace(undefined);
    if (!map) return;
    if (hoveredId.current && hoveredId.current !== hoveredPlace?.uuid) {
      map.setFeatureState(
        {
          source: areasSourceId,
          sourceLayer: areasSourceId,
          id: hoveredId.current,
        },
        { hovered: false }
      );
      hoveredId.current = undefined;
    }

    if (hoveredPlace) {
      map.setFeatureState(
        {
          source: areasSourceId,
          sourceLayer: areasSourceId,
          id: hoveredPlace.uuid,
        },
        { hovered: true }
      );
      hoveredId.current = hoveredPlace.uuid;
    } else {
      hoveredId.current = undefined;
      map.removeFeatureState({
        source: areasSourceId,
        sourceLayer: areasSourceId,
      });
    }
  }, [map, hoveredPlace]);

  useEffect(() => {
    if (activePlace) setHoveredPlace(undefined);
  }, [activePlace, setHoveredPlace]);

  if (map) {
    return (
      <>
        {places.map((place) => {
          return (
            <ClientOnly key={`popup-${place.uuid}`}>
              <>
                <PlacePopup
                  show={activePlace == place}
                  location={place.location}
                  onClose={() => setActivePlace(undefined)}
                  zoomToFeature={false}
                  anchor={
                    place.types.includes("Barrier Island") ? "right" : undefined
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
                  <div
                    className="tracking-loose my-2"
                    dangerouslySetInnerHTML={{
                      __html: place.short_description ?? "",
                    }}
                  />
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
            </ClientOnly>
          );
        })}
      </>
    );
  }

  return null;
};

export default FeaturedPlaces;
