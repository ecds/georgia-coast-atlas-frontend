import { Suspense, useEffect, useRef, useState } from "react";
import {
  useLoaderData,
  defer,
  useNavigate,
  useLocation,
} from "@remix-run/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { fetchPlaceBySlug, fetchRelatedRecords } from "~/data/coredata";
import { PlaceContext } from "~/contexts";
import Heading from "~/components/layout/Heading";
import FeaturedMedium from "~/components/FeaturedMedium";
import PlaceContent from "~/components/layout/PlaceContent";
import RelatedRecords from "~/components/layout/RelatedRecords";
import PlaceGeoJSON from "~/components/mapping/PlaceGeoJSON";
import Loading from "~/components/layout/Loading";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type {
  TPlaceRecord,
  TPlaceSource,
  TRelatedCoreDataRecords,
} from "~/types";
// import { faArrowCircleLeft, faArrowLeft, faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.id) {
    throw new Response(null, {
      status: 404,
      statusText: "You must provide an identifier for a place.",
    });
  }

  const place = await fetchPlaceBySlug(params.id);
  if (!place) {
    throw new Response(null, {
      status: 404,
      statusText: `${params.id} not found.`,
    });
  }
  const related: TRelatedCoreDataRecords | {} = await fetchRelatedRecords(
    place.uuid
  );

  return defer({ place, related });
};
const PlacePage = () => {
  const { place, related } = useLoaderData<TPlaceRecord>();
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const [layerSources, setLayerSources] = useState<TPlaceSource>({});
  const [backTo, setBackTo] = useState<boolean>(false);
  const topRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // setBackToSearch(location.state == "fromSearch");
    setBackTo(location.state?.backTo ?? undefined);
  }, [location]);

  return (
    <PlaceContext.Provider
      value={{
        place,
        activeLayers,
        setActiveLayers,
        layerSources,
        setLayerSources,
        geoJSON: place.geojson,
      }}
    >
      <Suspense fallback={<Loading />}>
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
            {place.name}
          </Heading>
          <div ref={topRef} className="relative -top-12 z-10 min-h-10">
            <FeaturedMedium record={related} />
          </div>
          <div
            className="relative px-4 -mt-12 primary-content"
            dangerouslySetInnerHTML={{
              __html: place.description,
            }}
          />
        </PlaceContent>
        <RelatedRecords related={related} />
        {place.geojson && <PlaceGeoJSON />}
      </Suspense>
    </PlaceContext.Provider>
  );
};

export default PlacePage;
