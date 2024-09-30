import { useRef, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import {
  fetchPlaceRecordByIdentifier,
  fetchRelatedRecords,
} from "~/data/coredata";
import { PlaceContext } from "~/contexts";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type {
  TPlaceRecord,
  TPlaceSource,
  TRelatedCoreDataRecords,
} from "~/types";
import Heading from "~/components/layout/Heading";
import FeaturedMedium from "~/components/FeaturedMedium";
import PlaceContainer from "~/components/layout/PlaceContainer";
import PlaceContent from "~/components/layout/PlaceContent";
import RelatedRecords from "~/components/layout/RelatedRecords";
import PlaceGeoJSON from "~/components/mapping/PlaceGeoJSON";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import { ClientOnly } from "remix-utils/client-only";
import Map from "~/components/mapping/Map.client";
import StyleSwitcher from "~/components/mapping/StyleSwitcher";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.id) {
    throw new Response(null, {
      status: 404,
      statusText: "You must provide an identifier for a place.",
    });
  }

  const place = await fetchPlaceRecordByIdentifier(params.id);
  if (!place) {
    throw new Response(null, {
      status: 404,
      statusText: `${params.id} not found.`,
    });
  }
  const related: TRelatedCoreDataRecords | {} = await fetchRelatedRecords(
    place.uuid
  );

  const geoJSON = toFeatureCollection([place]);

  return { place, related, geoJSON };
};
const PlacePage = () => {
  const { place, related, geoJSON } = useLoaderData<TPlaceRecord>();
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const [layerSources, setLayerSources] = useState<TPlaceSource>({});
  const topRef = useRef<HTMLDivElement>(null);

  return (
    <PlaceContext.Provider
      value={{
        place,
        activeLayers,
        setActiveLayers,
        layerSources,
        setLayerSources,
        geoJSON,
      }}
    >
      <PlaceContainer>
        <PlaceContent>
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
        {geoJSON && <PlaceGeoJSON />}
        <div className="hidden md:block w-1/2 lg:w-3/5">
          <ClientOnly>
            {() => (
              <Map>
                <StyleSwitcher></StyleSwitcher>
              </Map>
            )}
          </ClientOnly>
        </div>
      </PlaceContainer>
    </PlaceContext.Provider>
  );
};

export default PlacePage;
