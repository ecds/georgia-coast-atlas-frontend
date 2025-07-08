import { useCallback, useContext, useEffect, useState } from "react";
import { MapContext } from "~/contexts";
import { clusterCount, largeCluster } from "~/mapStyles/geoJSON";
import PlacePopup from "~/components/mapping/PlacePopup.client";
import ClientOnly from "~/components/ClientOnly";
import { Link } from "react-router";
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
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const [clusterList, setClusterList] =
    useState<{ title: string; slug: string }[]>();

  const mousemove = useCallback(
    (event: MapLayerMouseEvent) => {
      if (!event.features || !map) return;
      map.getCanvas().style.cursor = "pointer";
    },
    [map]
  );

  const mouseleave = useCallback(() => {
    if (!map) return;
    map.getCanvas().style.cursor = "";
  }, [map]);

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
      setClickedLocation({ lon: event.lngLat.lng, lat: event.lngLat.lat });
      setShowPopup(true);
      // titles.pop();
      const list = titles.map((title: string, index: number) => {
        return { title, slug: slugs[index] };
      });
      setClusterList(list);
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

    map.addSource(sourceId, layerSource);

    map.addLayer(
      clusterCount({
        id: `counts-${layerId}`,
        source: sourceId,
        textColor: "white",
      })
    );

    map.addLayer(
      largeCluster({ id: layerId, source: sourceId, fillColor: "#5D414A" }),
      "countySeats"
    );

    map.on("click", `counts-${layerId}`, handleClick);
    map.on("mousemove", layerId, mousemove);
    map.on("mouseleave", layerId, mouseleave);

    return () => {
      if (map.getLayer(layerId)) {
        map.off("click", `counts-${layerId}`, handleClick);
        map.off("mousemove", layerId, mousemove);
        map.off("mouseleave", layerId, mouseleave);
        map.removeLayer(layerId);
        map.removeLayer(`counts-${layerId}`);
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
      <PlacePopup
        location={clickedLocation}
        show={showPopup}
        zoomToFeature={false}
        showCloseButton={true}
      >
        <ul>
          {clusterList?.map((place) => {
            return (
              <li key={place.slug}>
                <Link
                  state={{ title: "Search Results", slug: "search" }}
                  className="text-blue-600 underline underline-offset-2 hover:text-blue-900"
                  to={`/places/${place.slug}`}
                >
                  {place.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </PlacePopup>
    </ClientOnly>
  );
};

export default GeoSearchClusters;
