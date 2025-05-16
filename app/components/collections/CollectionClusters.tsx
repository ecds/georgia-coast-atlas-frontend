import { useContext, useEffect, useState } from "react";
import { bbox } from "@turf/turf";
import { Link } from "react-router";
import { LngLatBounds } from "maplibre-gl";
import { MapContext } from "~/contexts";
import { cluster, clusterCount } from "~/mapStyles/geoJSON";
import PlacePopup from "../mapping/PlacePopup.client";
import type {
  GeoJSONSource,
  MapLayerMouseEvent,
  SourceSpecification,
} from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import type { CollectionType } from "~/esTypes";

interface Props {
  geojson: FeatureCollection;
  collectionType: CollectionType;
}

const CollectionClusters = ({ geojson, collectionType }: Props) => {
  const { map } = useContext(MapContext);
  const [activeCluster, setActiveCluster] = useState<{
    location: { lat: number; lon: number };
    list: { name: string; slug: string }[];
  }>();

  useEffect(() => {
    if (!map || !geojson?.features?.length) return;

    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    const handleClick = async ({ features }: MapLayerMouseEvent) => {
      if (!features?.[0]) return;

      const feature = features[0];
      const properties = feature.properties;
      const source = map.getSource(sourceId) as GeoJSONSource;
      const points = await source.getClusterChildren(properties.cluster_id);
      // @ts-expect-error: coordinates totally exists on type Geometry
      const [lng, lat] = points[0].geometry.coordinates;

      if (map.getZoom() < 15) {
        if (!source) return;
        const zoom = await source.getClusterExpansionZoom(
          feature.properties.cluster_id
        );
        map.easeTo({ center: { lng, lat }, zoom: zoom < 15 ? zoom : 15 });
      } else {
        const slugs = properties.slugs.split("|");
        const names = properties.names.split("|");
        const list = names.map((name: string, index: number) => {
          return { name, slug: slugs[index] };
        });
        setActiveCluster({ location: { lon: lng, lat }, list });
      }
    };

    const sourceId = "collectionCluster";
    const clusterLayer = cluster({
      id: `${sourceId}-clusters`,
      source: sourceId,
      fillColor: "#1d4ed8",
    });

    const countLayer = clusterCount({
      id: `${sourceId}-counts`,
      source: sourceId,
      textColor: "white",
    });

    const clusterSource: SourceSpecification = {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterMaxZoom: 22,
      clusterRadius: 50,
      promoteId: "uuid",
      clusterProperties: {
        // Not sure why the double concat is needed.
        names: ["concat", ["concat", ["get", "name"], "|"]],
        slugs: ["concat", ["concat", ["get", "slug"], "|"]],
      },
    };

    map.addSource(sourceId, clusterSource);
    map.addLayer(clusterLayer);
    map.addLayer(countLayer);

    const bounds = new LngLatBounds(
      bbox(geojson) as [number, number, number, number]
    );
    map.fitBounds(bounds, { padding: 50, maxZoom: 13 });

    map.on("mousemove", clusterLayer.id, handleMouseEnter);
    map.on("mouseleave", clusterLayer.id, handleMouseLeave);
    map.on("click", clusterLayer.id, handleClick);

    return () => {
      map.off("mousemove", clusterLayer.id, handleMouseEnter);
      map.off("mouseleave", clusterLayer.id, handleMouseLeave);
      map.off("click", clusterLayer.id, handleClick);
      map.removeLayer(clusterLayer.id);
      map.removeLayer(countLayer.id);
      map.removeSource(sourceId);
    };
  }, [map, geojson]);

  if (activeCluster) {
    return (
      <PlacePopup
        location={activeCluster.location}
        show={true}
        onClose={() => setActiveCluster(undefined)}
        zoomToFeature={false}
      >
        <ul>
          {activeCluster.list.map((item) => {
            return (
              <li key={item.slug}>
                <Link
                  to={`/collections/${collectionType}/${item.slug}`}
                  state={{ backTo: `Back to ${collectionType} Collection` }}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </PlacePopup>
    );
  }

  return null;
};

export default CollectionClusters;
