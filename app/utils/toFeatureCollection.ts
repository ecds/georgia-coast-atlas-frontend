import { featureCollection, point } from "@turf/turf";
import { PLACE_TYPES, THEME_COLORS } from "~/config";
import type { TPlaceGeoJSON } from "~/types";
import type { Hit } from "instantsearch.js";
import type { FeatureCollection } from "geojson";
import type { ESPlace, ESRelatedPlace } from "~/esTypes";

// TODO: Maybe use Tailwind config to keep things constant.
const DEFAULT_COLOR = "#ea580c";

export const getColor = (type: string) => {
  // if (!getComputedStyle) return;
  // const styles = getComputedStyle(document.documentElement);
  // const typeColors = PLACE_TYPES[type];
  // if (typeColors && typeColors.bgColor) {
  //   const parts = typeColors.bgColor.split("-") as ["blue", "700"]; // TODO: Make type for Tailwind colors
  //   console.log("🚀 ~ getColor ~ parts:", parts, THEME_COLORS);
  //   if (Object.keys(THEME_COLORS).includes(parts[0])) {
  //     return THEME_COLORS[parts[0]][parts[1]];
  //   } else {
  //     return styles.getPropertyValue(`--color-${parts[0]}-${parts[1]}`);
  //   }
  // }
  return DEFAULT_COLOR;
};

export const toFeatureCollection = (places: ESRelatedPlace[] | ESPlace[]) => {
  return featureCollection(
    places.map((place) => {
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
          preview: hit.featured_photograph?.replace("max", "600,"),
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
        properties: {
          ...place,
          hexColor: getColor(place.types[0]),
        },
        geometry: {
          type: "Point",
          coordinates: [place.location.lon, place.location.lat],
        },
      },
    ],
  };

  return featureCollection;
};
