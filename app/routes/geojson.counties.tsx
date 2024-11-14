import { json } from "@remix-run/node";
import { fetchPlacesGeoJSON } from "~/data/coredata";
import type { LoaderFunction } from "@remix-run/node";
import { placesToFeatureCollection } from "~/utils/toFeatureCollection";
import { countyIndexCollection } from "~/config";

export const loader: LoaderFunction = async () => {
  const countyGeoJSON = await fetchPlacesGeoJSON({
    collection: countyIndexCollection,
  });
  const countyFeatureCollection = placesToFeatureCollection(countyGeoJSON);
  return json(countyFeatureCollection);
};
