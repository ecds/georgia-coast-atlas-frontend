import { feature, featureCollection } from "@turf/turf";
import { PLACE_TYPES } from "~/config";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config";
import type { TPlaceRecord, TRelatedPlaceRecord } from "~/types";
import type { Hit } from "instantsearch.js";
import type { FeatureCollection } from "geojson";

// TODO: Maybe use Tailwind config to keep things constant.
const DEFAULT_COLOR = "#ea580c";

const getColor = (type: string) => {
  const tailwindColors = resolveConfig(tailwindConfig).theme.colors;
  const typeColors = PLACE_TYPES[type];
  if (typeColors && typeColors.bgColor) {
    const parts = typeColors.bgColor.split("-") as ["blue", "700"]; // TODO: Make type for Tailwind colors
    return tailwindColors[parts[0]][parts[1]];
  }
  return DEFAULT_COLOR;
};

export const toFeatureCollection = (
  places: TPlaceRecord[] | TRelatedPlaceRecord[]
) => {
  return featureCollection(
    places.map((place) => {
      const placeFeature = feature(place.place_geometry.geometry_json);
      placeFeature.properties = place;
      placeFeature.properties.hexColor = DEFAULT_COLOR;
      return placeFeature;
    })
  );
};

export const hitsToFeatureCollection = (hits: Hit[]) => {
  const geoHits = hits.filter((hit) => hit.location);
  const featureCollection: FeatureCollection = {
    type: "FeatureCollection",
    features: geoHits.map((hit) => {
      let hexColor = DEFAULT_COLOR;
      if (hit.types) {
        hexColor = getColor(hit.types[0]);
      }

      return {
        type: "Feature",
        properties: {
          name: hit.name,
          description: hit.description,
          identifier: hit.identifier,
          hexColor,
        },
        geometry: {
          type: "Point",
          coordinates: [hit.location?.lon, hit.location?.lat],
        },
      };
    }),
  };
  return featureCollection;
};
