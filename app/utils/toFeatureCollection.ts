import { feature, featureCollection } from "@turf/turf";
import { modelFieldUUIDs } from "~/config";
import type { TCoreDataPlaceRecord } from "~/types";
import type { Hit } from "instantsearch.js";

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
        name,
        description: hit[modelFieldUUIDs.description],
      };
      return hitFeature;
    }),
  );
};
