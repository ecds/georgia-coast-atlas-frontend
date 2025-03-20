import { Link, useLoaderData } from "@remix-run/react";
import { fetchPlacesByType } from "~/data/coredata";
import Islands from "~/components/mapping/Islands";
import Counties from "~/components/mapping/Counties";
import type { LoaderFunction } from "@remix-run/node";
import type { ESPlace } from "~/esTypes";
import { useContext, useEffect } from "react";
import { MapContext } from "~/contexts";
import { defaultBounds } from "~/config";

export const loader: LoaderFunction = async () => {
  const islands = await fetchPlacesByType("Barrier Island");
  const counties = await fetchPlacesByType("County");

  return {
    islands,
    counties,
  };
};

const ExplorePage = () => {
  const { islands, counties } = useLoaderData<{
    islands: ESPlace[];
    counties: ESPlace[];
  }>();

  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;
    map.fitBounds(defaultBounds());
  }, [map]);

  return (
    <div>
      <h3 className="mx-6 text-xl font-semibold">Islands</h3>
      <ul className="mx-6">
        {islands.length > 0 ? (
          islands.map((island) => (
            <li key={island.uuid} className="py-2">
              <Link
                to={`/places/${island.slug}`}
                // state={{ title: "Explore", slug: "explore" }}
                className="text-black hover:text-blue-800"
              >
                {island.name}
              </Link>
            </li>
          ))
        ) : (
          <p className="mx-6 text-gray-500">No islands available.</p>
        )}
      </ul>

      <div className="relative w-full">
        <Islands islands={islands} />
      </div>

      <h3 className="mx-6 text-xl font-semibold mt-4">Counties</h3>
      <ul className="mx-6">
        {counties.length > 0 ? (
          counties.map((county) => (
            <li key={county.slug} className="py-2">
              <Link
                to={`/places/${county.slug}`}
                // state={{ title: "Explore", slug: "explore" }}
                className="text-black hover:text-blue-800"
              >
                {county.name}
              </Link>
            </li>
          ))
        ) : (
          <p className="mx-6 text-gray-500">No counties available.</p>
        )}
      </ul>
      <div className="relative h-96 w-full">
        <Counties counties={counties} />
      </div>
    </div>
  );
};

export default ExplorePage;
