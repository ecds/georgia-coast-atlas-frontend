import { Suspense, useContext, useEffect, useRef, useState } from "react";
import {
  useLoaderData,
  useNavigate,
  useLocation,
  Await,
  useNavigation,
} from "@remix-run/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { fetchPlaceBySlug } from "~/data/coredata";
import { MapContext, PlaceContext } from "~/contexts";
import Heading from "~/components/layout/Heading";
import FeaturedMedium from "~/components/FeaturedMedium";
import PlaceContent from "~/components/layout/PlaceContent";
import PlaceGeoJSON from "~/components/mapping/PlaceGeoJSON";
import Loading from "~/components/layout/Loading";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { TPlaceRecord } from "~/types";
import { indexCollection } from "~/config";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.id) {
    throw new Response(null, {
      status: 404,
      statusText: "You must provide a place in the address, eg. sapelo-island.",
    });
  }

  const place = await fetchPlaceBySlug(params.id, indexCollection);
  if (!place) {
    throw new Response(null, {
      status: 404,
      statusText: `${params.id} not found.`,
    });
  }

  return { place };
};

const PlacePage = () => {
  const { place } = useLoaderData<TPlaceRecord>();
  const { map } = useContext(MapContext);
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const [backTo, setBackTo] = useState<boolean>(false);
  const topRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const location = useLocation();

  useEffect(() => {
    setBackTo(location.state?.backTo ?? undefined);
  }, [location]);

  useEffect(() => {
    if (navigation.state === "loading" && map) {
      if (map && map.getLayer(`place-${place.uuid}`))
        map.removeLayer(`place-${place.uuid}`);
    }
  }, [navigation, map, place]);

  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={place}>
        {(resolvedPlace) => (
          <PlaceContext.Provider
            value={{
              place: resolvedPlace,
              activeLayers,
              setActiveLayers,
            }}
          >
            <>
              <PlaceContent>
                {backTo && (
                  <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-300 hover:bg-gray-400 border-spacing-1 drop-shadow-sm px-6 py-2 rounded-lg text-left w-max m-4 text-xs"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to {backTo}
                  </button>
                )}
                <Heading
                  as="h1"
                  className="text-2xl px-4 pt-4 sticky top-0 z-10 bg-white"
                >
                  {resolvedPlace.name}
                </Heading>
                <div ref={topRef} className="relative -top-12 z-10 min-h-10">
                  <FeaturedMedium record={resolvedPlace} />
                </div>
                <div
                  className="relative px-4 -mt-12 primary-content"
                  dangerouslySetInnerHTML={{
                    __html: resolvedPlace.description,
                  }}
                />
              </PlaceContent>
              <PlaceGeoJSON />
            </>
          </PlaceContext.Provider>
        )}
      </Await>
    </Suspense>
  );
};

export default PlacePage;
