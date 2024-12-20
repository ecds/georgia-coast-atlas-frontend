import { useCallback, useContext, useEffect, useState } from "react";
import { MapContext } from "~/contexts";
import { largeCluster } from "~/mapStyles/geoJSON";
import PlacePopup from "~/components/mapping/PlacePopup.client";
import { ClientOnly } from "remix-utils/client-only";
import { Link } from "@remix-run/react";
import type { FeatureCollection } from "geojson";
import type { MapLayerMouseEvent, SourceSpecification } from "maplibre-gl";

interface Props {
  geojson: FeatureCollection;
}

const sourceId = "clustered-hits-source";
const layerId = "clustered-hits-layer";

const GeoSearchClusters = ({ geojson }: Props) => {
  const { map, mapLoaded } = useContext(MapContext);
  const [clickedLocation, setClickedLocation] = useState<{
    lat: number;
    lon: number;
  }>({ lat: 0, lon: 0 });
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupTitle, setPopupTitle] = useState<string | undefined>();
  const [clusterList, setClusterList] =
    useState<{ title: string; slug: string }[]>();

  const mousemove = useCallback(
    (event: MapLayerMouseEvent) => {
      if (!event.features || !map || clusterList) return;
      const features = event.features;
      map.getCanvas().style.cursor = "pointer";
      setClickedLocation({ lat: event.lngLat.lat, lon: event.lngLat.lng });
      if (features[0].properties.point_count) {
        setPopupTitle(`${features[0].properties.point_count} Places`);
      } else {
        setPopupTitle(features[0].properties.name);
      }
      setShowPopup(true);
    },
    [map, clusterList]
  );

  const mouseleave = useCallback(() => {
    if (!map || clusterList) return;
    map.getCanvas().style.cursor = "";
    if (!clusterList) {
      setShowPopup(false);
    } else {
      setClusterList(undefined);
    }
  }, [map, clusterList]);

  const handleClick = useCallback(
    (event: MapLayerMouseEvent) => {
      if (
        !map ||
        !event.features ||
        !event.features.length ||
        !event.features[0].properties.point_count
      )
        return;
      const properties = event.features[0].properties;
      const slugs = properties.slugs.split("|");
      const titles = properties.names.split("|");
      titles.pop();
      const list = titles.map((title: string, index: number) => {
        return { title, slug: slugs[index] };
      });
      setClusterList(list);
      setPopupTitle(undefined);
      setShowPopup(true);
    },
    [map]
  );

  useEffect(() => {
    if (!mapLoaded || !map || !geojson) return;

    const layerSource: SourceSpecification = {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterRadius: 10,
      clusterProperties: {
        // Not sure why the double concat is needed.
        names: ["concat", ["concat", ["get", "name"], "|"]],
        slugs: ["concat", ["concat", ["get", "slug"], "|"]],
      },
    };

    if (!map.getSource(sourceId)) map.addSource(sourceId, layerSource);

    if (!map.getLayer(layerId))
      map.addLayer(
        largeCluster({ id: layerId, source: sourceId, fillColor: "#5D414A" }),
        "countySeats"
      );
    map.on("click", layerId, handleClick);
    map.on("mousemove", layerId, mousemove);
    map.on("mouseleave", layerId, mouseleave);

    return () => {
      if (map.getLayer(layerId)) {
        map.off("click", layerId, handleClick);
        map.off("mousemove", layerId, mousemove);
        map.off("mouseleave", layerId, mouseleave);
        map.removeLayer(layerId);
      }

      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [
    geojson,
    map,
    mapLoaded,
    handleClick,
    clusterList,
    mousemove,
    mouseleave,
  ]);

  return (
    <ClientOnly>
      {() => (
        <PlacePopup
          location={clickedLocation}
          show={showPopup}
          onClose={() => {
            setShowPopup(false);
            setClusterList(undefined);
          }}
          zoomToFeature={false}
          showCloseButton={clusterList instanceof Array}
        >
          <div>
            <h4>{popupTitle}</h4>
            <ul>
              {clusterList?.map((place) => {
                return (
                  <li key={place.slug}>
                    <Link
                      state={{ backTo: "Search Results" }}
                      className="text-blue-600 underline underline-offset-2 hover:text-blue-900"
                      to={`/places/${place.slug}`}
                    >
                      {place.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </PlacePopup>
      )}
    </ClientOnly>
  );
};

export default GeoSearchClusters;
