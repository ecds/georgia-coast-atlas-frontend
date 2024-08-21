import { feature, featureCollection, explode, polygon } from "@turf/turf";
import { modelFieldUUIDs } from "~/config";
import type { TCoreDataPlaceRecord } from "~/types";
import type { Hit } from "instantsearch.js";
console.log("🚀 ~ explode:", explode, polygon);

export const toFeatureCollection = (places: TCoreDataPlaceRecord[]) => {
  return featureCollection(
    places.map((place) => {
      const placeFeature = feature(place.place_geometry.geometry_json);
      placeFeature.properties = place;
      return placeFeature;
    }),
  );
};

export const hitsToFeatureCollection = (hits: Hit[]) => {
  return featureCollection(
    hits.map((hit) => {
      const hitFeature = feature(hit.geometry);
      hitFeature.properties = {
        name: hit.name,
        description: hit[modelFieldUUIDs.description],
      };
      return hitFeature;
    }),
  );
};
