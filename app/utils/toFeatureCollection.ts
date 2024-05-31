import { feature, featureCollection } from "@turf/turf";
import type { TCoreDataPlaceRecord } from "~/types";

export const toFeatureCollection = (places: TCoreDataPlaceRecord[]) => {
  return featureCollection(
    places.map((place) => {
      const placeFeature = feature(place.place_geometry.geometry_json);
      placeFeature.properties = place;
      return placeFeature;
    }),
  );
};
