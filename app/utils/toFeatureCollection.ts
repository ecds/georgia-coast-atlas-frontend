import { feature, featureCollection } from "@turf/turf";
import type { TCoreDataPlaceRecord } from "~/types";

export const toFeatureCollection = (places: TCoreDataPlaceRecord[]) => {
  return featureCollection(
    places.map((place) => feature(place.place_geometry.geometry_json)),
  );
};
