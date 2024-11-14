import { json } from "@remix-run/node";
import { fetchPlacesGeoJSON } from "~/data/coredata";
import type { LoaderFunction } from "@remix-run/node";
import { placesToFeatureCollection } from "~/utils/toFeatureCollection";

export const loader: LoaderFunction = async () => {
  const filter = [
    {
      term: {
        types: "Barrier Island",
      },
    },
  ];

  const islandGeoJSON = await fetchPlacesGeoJSON({ filter });
  const islandFeatureCollection = placesToFeatureCollection(islandGeoJSON);
  return json(islandFeatureCollection);
};
