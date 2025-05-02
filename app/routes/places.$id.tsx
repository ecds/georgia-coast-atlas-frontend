import { useEffect, useRef, useState } from "react";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { PlaceContext } from "~/contexts";
import { fetchBySlug } from "~/data/coredata";
import Heading from "~/components/layout/Heading";
import FeaturedMedium from "~/components/FeaturedMedium";
import { dataHosts, indexCollection } from "~/config";
import { pageMetadata } from "~/utils/pageMetadata";
import RelatedPlaces from "~/components/relatedRecords/RelatedPlaces";
import RelatedMapLayers from "~/components/relatedRecords/RelatedMapLayers";
import RelatedTopoQuads from "~/components/relatedRecords/RelatedTopoQuads";
import RelatedSection from "~/components/relatedRecords/RelatedSection";
import RelatedMedia from "~/components/relatedRecords/RelatedMedia";
import PlaceMap from "~/components/places/PlaceMap";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import type { ESPlace, ESRelatedPlace } from "~/esTypes";
import type { TWordPressData } from "~/types";
import type { LngLatBounds } from "maplibre-gl";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return pageMetadata(data?.place as ESPlace);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const place: ESPlace = await fetchBySlug(params.id, indexCollection);

  if (!place) {
    throw new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const wpResponse = await fetch(
    `https://${dataHosts.wordPress}/wp-json/wp/v2/pages/?slug=${params.id}`
  );

  let wpData: TWordPressData | undefined = undefined;

  const data = await wpResponse.json();
  if (wpResponse.status === 200 && data.length > 0) {
    wpData = data[0];
  }

  return { place, wpData };
};

const PlacePage = () => {
  const { place, wpData } = useLoaderData<typeof loader>();
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const [activePlace, setActivePlace] = useState<
    ESRelatedPlace | ESPlace | undefined
  >();
  const [hoveredPlace, setHoveredPlace] = useState<
    ESRelatedPlace | ESPlace | undefined
  >();
  const [noTrackMouse, setNoTrackMouse] = useState<boolean>(false);
  const [backTo, setBackTo] = useState<
    | {
        slug: string;
        title: string;
        bounds?: LngLatBounds;
        previous: string;
        search?: string;
      }
    | undefined
  >(undefined);
  const topRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    setBackTo(location.state);
  }, [location]);

  useEffect(() => {
    console.log(
      "🚀 ~ PlacePage ~ activePlace, hoveredPlace:",
      activePlace,
      hoveredPlace
    );
  }, [activePlace, hoveredPlace]);

  return (
    <PlaceContext.Provider
      value={{
        place,
        activeLayers,
        setActiveLayers,
        activePlace,
        setActivePlace,
        hoveredPlace,
        setHoveredPlace,
        noTrackMouse,
        setNoTrackMouse,
        clusterFillColor: "#ea580c",
        clusterTextColor: "black",
      }}
    >
      <>
        {backTo && (
          <nav className="w-full bg-white z-50 sticky top-0 py-2">
            <Link
              to={`/places/${backTo.slug}`}
              state={backTo}
              className="block bg-gray-300 hover:bg-gray-400 border-spacing-1 drop-shadow-sm px-6 py-1 rounded-lg text-left w-max m-2 text-xs"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Back to {backTo.title}
            </Link>
          </nav>
        )}
        <Heading
          as="h1"
          className={`text-2xl px-4 py-1 pb-1 sticky ${backTo ? "top-[3.25rem]" : "top-0"} z-10 bg-white shadow-md`}
        >
          {place.name}
        </Heading>
        <div ref={topRef} className="relative -top-16 z-20 min-h-10">
          <FeaturedMedium record={place} />
        </div>
        <div
          className={`relative px-4 ${place.featured_photograph || place.featured_video ? "-mt-16" : "-mt-8"} primary-content min-h-32`}
          dangerouslySetInnerHTML={{
            __html:
              wpData?.content.rendered ??
              place.description ??
              place.short_description,
          }}
        />
        <div className="px-4">
          {place.types.includes("Barrier Island") ||
          place.types.includes("County") ? (
            <RelatedPlaces />
          ) : (
            <PlaceMap />
          )}
          <RelatedMedia title="Videos" records={place.videos} />
          <RelatedMedia title="Photographs" records={place.photographs} />
          <RelatedMedia title="Panos" records={place.panos} />
          <RelatedMapLayers />
          <RelatedTopoQuads />
          {place.identifiers && place.identifiers.length > 0 && (
            <RelatedSection title="See Also">
              {place.identifiers?.map((identifier) => {
                return (
                  <a
                    key={identifier.authority}
                    href={identifier.identifier}
                    className="block my-2 uppercase text-county hover:text-activeCounty underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {identifier.authority}{" "}
                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      className="text-sm"
                    />
                  </a>
                );
              })}
            </RelatedSection>
          )}
        </div>
      </>
    </PlaceContext.Provider>
  );
};

export default PlacePage;
