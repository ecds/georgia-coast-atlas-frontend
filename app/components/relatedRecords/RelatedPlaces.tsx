import { useCallback, useContext, useEffect, useState } from "react";
import RelatedSection from "./RelatedSection";
import { MapContext, PlaceContext } from "~/contexts";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import PlacePopup from "../mapping/PlacePopup";
import { cluster, clusterCount, singlePoint } from "~/mapStyles/geoJSON";
import { Link } from "@remix-run/react";
import type {
  GeoJSONSource,
  MapLayerMouseEvent,
  SourceSpecification,
} from "maplibre-gl";
import type { ESRelatedPlace } from "~/esTypes";

const RelatedPlaces = () => {
  const { map } = useContext(MapContext);
  const { place, setLayerSources, setActiveLayers } = useContext(PlaceContext);
  const [activePlace, setActivePlace] = useState<ESRelatedPlace | undefined>(
    undefined
  );

  const handleClick = useCallback(
    async ({ features, lngLat, ...rest }: MapLayerMouseEvent) => {
      if (!map) return;

      if (features && features[0].id) {
        const clickedPlace = place.places.find(
          (relatedPlaces) => relatedPlaces.uuid === features[0].id
        );
        setActivePlace(clickedPlace);
      }
      if (features && features[0].properties.cluster) {
        const source: GeoJSONSource | undefined = map.getSource(
          features[0].layer.source
        );
        if (!source) return;
        const zoom = await source.getClusterExpansionZoom(
          features[0].properties.cluster_id
        );
        map.easeTo({
          center: lngLat,
          zoom,
        });
      }
    },
    [map, place]
  );

  const handleMouseEnter = useCallback(() => {
    if (!map) return;
    map.getCanvas().style.cursor = "pointer";
  }, [map]);

  const handleMouseLeave = useCallback(() => {
    if (!map) return;
    map.getCanvas().style.cursor = "";
  }, [map]);

  useEffect(() => {
    if (!map) return;
    if (place.places.length === 0) return;

    const geojson = toFeatureCollection(place.places);

    const placesSource: SourceSpecification = {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
      promoteId: "uuid",
    };

    if (map.getSource(`${place.uuid}-places`))
      map.removeSource(`${place.uuid}-places`);
    map.addSource(`${place.uuid}-places`, placesSource);

    const clusterLayer = cluster(
      `clusters-${place.uuid}`,
      `${place.uuid}-places`
    );

    if (!map.getLayer(clusterLayer.id)) {
      map.addLayer(clusterLayer);
    }

    const countLayer = clusterCount(
      `counts-${place.uuid}`,
      `${place.uuid}-places`
    );

    if (!map.getLayer(countLayer.id)) {
      map.addLayer(countLayer);
    }

    const unclusteredLayer = singlePoint(
      `points-${place.uuid}`,
      `${place.uuid}-places`
    );

    if (!map.getLayer(unclusteredLayer.id)) {
      map.addLayer(unclusteredLayer);
    }

    map.on("mouseenter", clusterLayer.id, handleMouseEnter);
    map.on("mouseenter", unclusteredLayer.id, handleMouseEnter);
    map.on("mouseleave", clusterLayer.id, handleMouseLeave);
    map.on("mouseleave", unclusteredLayer.id, handleMouseLeave);
    map.on("click", clusterLayer.id, handleClick);
    map.on("click", unclusteredLayer.id, handleClick);

    return () => {
      map.off("mouseenter", clusterLayer.id, handleMouseEnter);
      map.off("mouseleave", clusterLayer.id, handleMouseLeave);
      map.off("mouseenter", unclusteredLayer.id, handleMouseEnter);
      map.off("mouseleave", unclusteredLayer.id, handleMouseLeave);
      map.off("click", clusterLayer.id, handleClick);
      map.off("click", unclusteredLayer.id, handleClick);
      if (map.getLayer(clusterLayer.id)) map.removeLayer(clusterLayer.id);
      if (map.getLayer(countLayer.id)) map.removeLayer(countLayer.id);
      if (map.getLayer(unclusteredLayer.id))
        map.removeLayer(unclusteredLayer.id);
      if (map.getSource(`${place.uuid}-places`))
        map.removeSource(`${place.uuid}-places`);
      if (map.getSource(`${place.uuid}-places`))
        map.removeSource(`${place.uuid}-places`);
    };
  }, [
    map,
    place,
    handleClick,
    setActiveLayers,
    setLayerSources,
    handleMouseEnter,
    handleMouseLeave,
  ]);

  if (place.places.length === 0) {
    return null;
  }

  return (
    <RelatedSection title="Related Places">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {place.places.map((relatedPlace) => {
          return (
            <div key={`related-place-${relatedPlace.uuid}`}>
              <button
                className={`text-black/75 hover:text-black text-left md:py-1 ${activePlace === relatedPlace ? "underline font-bold" : ""}`}
                onClick={() => {
                  setActivePlace(relatedPlace);
                }}
              >
                {relatedPlace.name}
              </button>
              <PlacePopup
                location={{
                  lat: relatedPlace.location.lat,
                  lon: relatedPlace.location.lon,
                }}
                show={activePlace?.uuid === relatedPlace.uuid}
                onClose={() => setActivePlace(undefined)}
              >
                <h4 className="text-xl">{relatedPlace.name}</h4>
                {/* <div
                  dangerouslySetInnerHTML={{
                    __html: relatedPlace.description ?? "",
                  }}
                /> */}
                <Link
                  to={`/places/${relatedPlace.slug}`}
                  state={{ backTo: place.name }}
                  className="text-blue-600 underline underline-offset-2 hover:text-blue-900"
                >
                  Read More
                </Link>
              </PlacePopup>
            </div>
          );
        })}
      </div>
    </RelatedSection>
  );
};

export default RelatedPlaces;
