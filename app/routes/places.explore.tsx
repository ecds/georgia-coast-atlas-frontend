import { Link, useLoaderData } from "react-router";
import { fetchPlacesByType } from "~/data/coredata";
import FeaturedPlaces from "~/components/mapping/FeaturedPlaces";
import { useContext, useEffect, useState } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import { defaultBounds } from "~/config";
import type { LoaderFunction } from "react-router";
import type { ESPlace, ESRelatedPlace } from "~/esTypes";

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

  const [hoveredPlace, setHoveredPlace] = useState<
    ESPlace | ESRelatedPlace | undefined
  >(undefined);
  const [activePlace, setActivePlace] = useState<
    ESPlace | ESRelatedPlace | undefined
  >(undefined);

  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;
    map.fitBounds(defaultBounds());
  }, [map]);

  return (
    <PlaceContext.Provider
      value={{
        place: islands[0],
        hoveredPlace,
        setHoveredPlace,
        activePlace,
        setActivePlace,
        noTrackMouse: true,
      }}
    >
      <div className="my-6">
        <h3 className="mx-6 text-xl font-semibold">Islands</h3>
        <ul className="mx-6">
          {islands.length > 0 ? (
            islands.map((island) => (
              <li key={island.uuid} className="py-2 ml-2">
                <Link
                  onMouseEnter={() => {
                    setHoveredPlace(island);
                  }}
                  onMouseLeave={() => setHoveredPlace(undefined)}
                  to={`/places/${island.slug}`}
                  state={{ title: "Explore", previous: "/places/explore" }}
                  className={`${
                    hoveredPlace === island
                      ? "text-white bg-island"
                      : "text-black"
                  } p-2 rounded-sm`}
                >
                  {island.name}
                </Link>
              </li>
            ))
          ) : (
            <p className="mx-6 text-gray-500">No islands available.</p>
          )}
        </ul>

        <h3 className="mx-6 text-xl font-semibold mt-4">Counties</h3>
        <ul className="mx-6">
          {counties.length > 0 ? (
            counties.map((county) => (
              <li key={county.slug} className="py-2 ml-2">
                <Link
                  onMouseEnter={() => {
                    setHoveredPlace(county);
                  }}
                  onMouseLeave={() => setHoveredPlace(undefined)}
                  to={`/places/${county.slug}`}
                  state={{ title: "Explore", previous: "/places/explore" }}
                  className={`${
                    hoveredPlace === county
                      ? "text-white bg-activeCounty"
                      : "text-black"
                  } p-2 rounded-sm`}
                >
                  {county.name}
                </Link>
              </li>
            ))
          ) : (
            <p className="mx-6 text-gray-500">No counties available.</p>
          )}
        </ul>
      </div>
      <FeaturedPlaces places={[...islands, ...counties]} />
    </PlaceContext.Provider>
  );
};

export default ExplorePage;
