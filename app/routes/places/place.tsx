import { placeMetaTags } from "~/utils/placeMetaTags";
import { fetchBySlug } from "~/data/coredata";
import { dataHosts, indexCollection, PLACE_TYPES } from "~/config";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import type { ESPlace } from "~/esTypes";
import type { TWordPressData } from "~/types";
import Heading from "~/components/layout/Heading";
import FeaturedMedium from "~/components/FeaturedMedium";
import RelatedPlaces from "~/components/relatedRecords/RelatedPlaces";
import RelatedMedia from "~/components/relatedRecords/RelatedMedia";
import RelatedSection from "~/components/relatedRecords/RelatedSection";
import RelatedMapLayers from "~/components/relatedRecords/RelatedMapLayers";
import RelatedTopoQuads from "~/components/relatedRecords/RelatedTopoQuads";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import PlaceHighlight from "~/components/mapping/PlaceHighlight";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return placeMetaTags(data?.place as ESPlace);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const place: ESPlace = await fetchBySlug(params.slug, indexCollection);

  if (!place) {
    throw new Response(null, { status: 404, statusText: "Not found" });
  }

  const wpResponse = await fetch(
    `https://${dataHosts.wordPress}/wp-json/wp/v2/pages/?slug=${params.id}`
  );

  let wpData: TWordPressData | undefined = undefined;

  const data = await wpResponse.json();
  if (wpResponse.status === 200 && data.length > 0) {
    wpData = data[0];
  }

  // const wpData = { content: { rendered: "" } };
  return { place, wpData };
};

const Place = () => {
  const { place, wpData } = useLoaderData<typeof loader>();
  console.log("🚀 ~ Place ~ place:", place.geojson);
  const { map } = useContext(MapContext);
  const { setPlace, searchParams } = useContext(PlaceContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [useBack, setUseBack] = useState<boolean>(false);

  useEffect(() => {
    setUseBack(Boolean(location.state?.fromIndex));
  }, [location, searchParams]);

  useEffect(() => {
    if (!place || !map) return;

    if (setPlace) setPlace(place);

    for (const type of place.types) {
      const layer = type.toLowerCase().replaceAll(" ", "");
      if (map.getLayer(layer))
        map.setFilter(layer, ["!=", ["get", "uuid"], place.uuid]);
    }
  }, [place, map, setPlace]);

  const navigateTo = () => {
    if (useBack) navigate(-1);
    if (!useBack) navigate({ pathname: "/places", search: searchParams });
  };

  return (
    <>
      <div className="flex flex-row w-full shadow-md bg-white">
        <div
          className={`flex flex-col grow text-2xl px-4 py-1 pb-1 sticky top-0 z-10 bg-white rounded-t-md`}
        >
          <Heading as="h1">{place.name}</Heading>
          <div>
            {place.types.map((type) => {
              return (
                <span
                  key={type}
                  className={`p-1 text-xs font-medium me-2 mt-2 px-2 py-0.5 rounded-lg h-min w-max bg-${PLACE_TYPES[type]?.bgColor ?? "green-100"} text-${PLACE_TYPES[type]?.textColor ?? "green-800"} border-2 border-${PLACE_TYPES[type]?.textColor ?? "green-800"}`}
                >
                  {type}
                </span>
              );
            })}
          </div>
        </div>
        <button
          role="link"
          onClick={navigateTo}
          className="self-start pt-1 pe-2"
          title="Close"
        >
          <FontAwesomeIcon icon={faXmarkCircle} />
          <span className="sr-only">close</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-scroll bg-white">
        <div className="min-h-10">
          <FeaturedMedium record={place} />
        </div>
        <div
          className={`px-4 pb-4 primary-content`}
          dangerouslySetInnerHTML={{
            __html:
              wpData?.content.rendered ??
              place.description ??
              place.short_description,
          }}
        />
        <div className="px-4">
          <RelatedPlaces />
          <RelatedMedia title="Videos" records={place.videos} />
          <RelatedMedia title="Photographs" records={place.photographs} />
          <RelatedMedia title="Panos" records={place.panos} />
          {place.people && place.people.length > 0 && (
            <RelatedSection title="People" defaultOpen={false}>
              <dl className="p-4">
                {place.people.map((person) => {
                  return (
                    <>
                      <dt className="text-lg mb-2">{person.full_name}</dt>
                      <dd className="mb-3 tracking-wide">{person.biography}</dd>
                    </>
                  );
                })}
              </dl>
            </RelatedSection>
          )}
          {place.works && place.works.length > 0 && (
            <RelatedSection title="Works" defaultOpen={false}>
              <ul className="p-8">
                {place.works.map((work) => {
                  return (
                    <li
                      key={work.uuid}
                      className="prose prose-xl prose-invert leading-loose tracking-wide -indent-6 my-6"
                      dangerouslySetInnerHTML={{
                        __html: work.citation,
                      }}
                    />
                  );
                })}
              </ul>
            </RelatedSection>
          )}
          <RelatedMapLayers />
          <RelatedTopoQuads />
          {place.identifiers && place.identifiers.length > 0 && (
            <RelatedSection title="See Also">
              {place.identifiers?.map((identifier) => {
                return (
                  <a
                    key={identifier.identifier}
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
        <PlaceHighlight />
      </div>
    </>
  );
};

export default Place;
