import {
  Hits,
  Pagination,
  useCurrentRefinements,
  useGeoSearch,
  useHits,
  useSearchBox,
} from "react-instantsearch";
import SearchResult from "./SearchResult";
import { useContext, useEffect, useState } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import { gcaLayout, gcaPaint } from "~/mapStyles/full";
import { pointLayers } from "~/data/layers";
import type { FeatureCollection } from "geojson";
import { LngLatBounds, type MapLayerMouseEvent } from "maplibre-gl";
import type { ESPlace } from "~/esTypes";
import { bbox } from "@turf/turf";

const SearchResults = () => {
  const { query } = useSearchBox();
  const { items: refinements } = useCurrentRefinements();
  const { currentRefinement: geoRefinement } = useGeoSearch();
  const { items } = useHits();
  const { setClickedPlace, setHoveredPlace } = useContext(PlaceContext);
  const { map } = useContext(MapContext);
  const [isRefined, setIsRefined] = useState<boolean>(false);

  useEffect(() => {
    setIsRefined(
      Boolean(geoRefinement) || query !== "" || refinements.length > 0
    );
  }, [geoRefinement, query, refinements]);

  useEffect(() => {
    if (!map) return;

    const handleMouseEnter = ({ features, lngLat }: MapLayerMouseEvent) => {
      if (!features) return;
      map.getCanvas().style.cursor = "pointer";
      setHoveredPlace({
        ...features[0].properties,
        location: { lon: lngLat.lng, lat: lngLat.lat },
      } as ESPlace);
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
      setHoveredPlace(undefined);
    };

    const handleClick = ({ features }: MapLayerMouseEvent) => {
      if (!features || !setClickedPlace) return;

      setClickedPlace(features[0].properties.slug);
    };

    for (const pointLayer of pointLayers) {
      if (map.getLayer(`gca-${pointLayer.sourceLayer}`))
        map.setPaintProperty(
          `gca-${pointLayer.sourceLayer}`,
          "text-opacity",
          1
        );
    }

    if (map.getLayer("results")) map.removeLayer("results");
    if (map.getSource("results")) map.removeSource("results");

    const layers = [
      ...new Set(
        items.flatMap((item) =>
          item.types.map(
            (type: string) => `gca-${type.toLowerCase().replaceAll(" ", "")}`
          )
        )
      ),
    ];

    if (!isRefined) return;

    const uuids = items.map((item) => item.uuid);
    for (const layer of layers) {
      if (map.getLayer(layer)) {
        map.setPaintProperty(layer, "text-opacity", [
          "case",
          ["in", ["get", "uuid"], ["literal", uuids]],
          0,
          1,
        ]);
      }
    }

    const geojson: FeatureCollection = {
      type: "FeatureCollection",
      features: items.map((item) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [item.location.lon, item.location.lat],
          },
          properties: item,
        };
      }),
    };

    if (geojson.features.length > 0) {
      const bounds = new LngLatBounds(
        bbox(geojson) as [number, number, number, number]
      );
      map.fitBounds(bounds, { padding: 50, maxZoom: 13 });
    }

    map.addSource("results", {
      type: "geojson",
      data: geojson,
    });

    map.addLayer({
      id: "results",
      source: "results",
      type: "symbol",
      filter: ["==", "$type", "Point"],
      paint: gcaPaint({ color: "hsl(346.33, 44.13%, 35.1%)" }),
      layout: gcaLayout({ sourceLayer: "county" }),
    });

    map.on("click", "results", handleClick);
    map.on("mousemove", "results", handleMouseEnter);
    map.on("mouseleave", "results", handleMouseLeave);

    return () => {
      if (map.getLayer("results")) map.removeLayer("results");
      if (map.getSource("results")) map.removeSource("results");
      for (const layer of pointLayers) {
        if (!map.getLayer(`gca-${layer.sourceLayer}`)) return;
        if (isRefined) {
          map.setPaintProperty(`gca-${layer.sourceLayer}`, "text-opacity", 1);
        }
      }
    };
  }, [items, query, map, isRefined, setClickedPlace, setHoveredPlace]);

  if (isRefined) {
    return (
      <>
        <menu>
          <Hits hitComponent={SearchResult} />
          <Pagination
            classNames={{
              root: "px-2 py-4 w-full",
              list: "flex flex-row items-stretch justify-center",
              pageItem:
                "bg-county/70 text-white mx-4 text-center rounded-md min-w-6 max-w-8",
              selectedItem: "bg-county text-white",
            }}
            padding={2}
          />
        </menu>
      </>
    );
  }

  return <></>;
};

export default SearchResults;
