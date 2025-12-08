import { featureCollection, point } from "@turf/turf";
import { PLACE_TYPES } from "~/config";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config";
import type { TPlaceGeoJSON } from "~/types";
import type { Hit } from "instantsearch.js";
import type { FeatureCollection } from "geojson";
import type { ESPlace, ESRelatedPlace } from "~/esTypes";

// TODO: Maybe use Tailwind config to keep things constant.
const DEFAULT_COLOR = "#ea580c";

export const getColor = (type: string) => {
  const tailwindColors = resolveConfig(tailwindConfig).theme.colors;
  const typeColors = PLACE_TYPES[type];
  if (typeColors && typeColors.bgColor) {
    const parts = typeColors.bgColor.split("-") as ["blue", "700"]; // TODO: Make type for Tailwind colors
    return tailwindColors[parts[0]][parts[1]];
  }
  return DEFAULT_COLOR;
};

export const toFeatureCollection = (places: ESRelatedPlace[] | ESPlace[]) => {
  console.log("🚀 ~ toFeatureCollection ~ places:", places);
  return featureCollection(
    places.map((place) => {
      if (place.types) {
        place.type = place.types[0];
      }
      const placeFeature = point([place.location.lon, place.location.lat], {
        ...place,
        hexColor: place.type ? getColor(place.type) : "blue",
      });

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
          slug: hit.slug,
          description: hit.description,
          identifier: hit.identifier,
          hexColor,
          preview:
            hit.featured_photograph?.replace("max", "600,") ??
            hit.thumbnail_url,
          uuid: hit.uuid,
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

export const placesToFeatureCollection = (places: TPlaceGeoJSON[]) => {
  return {
    type: "FeatureCollection",
    features: places.map((place) => place.geojson.features).flat(),
  };
};

export const locationToFeatureCollection = (place: ESPlace) => {
  const featureCollection: FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { ...place, hexColor: getColor(place.types[0]) },
        geometry: {
          type: "Point",
          coordinates: [place.location.lon, place.location.lat],
        },
      },
    ],
  };

  return featureCollection;
};
