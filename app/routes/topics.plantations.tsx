import { useState } from "react";
import { fetchBySlug } from "~/data/coredata";
import { topicIndexCollection } from "~/config";
import { useLoaderData } from "react-router";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import { PlaceContext } from "~/contexts";
import RelatedPlacesDetailedList from "~/components/relatedRecords/RelatedPlacesDetailedList";
import RelatedPlacesMap from "~/components/relatedRecords/RelatedPlacesMap";
import Map from "~/components/mapping/Map.client";
import RelatedSection from "~/components/relatedRecords/RelatedSection";
import type { ESPlace, ESRelatedPlace } from "~/esTypes";

export const loader = async () => {
  const plantations: ESPlace = await fetchBySlug(
    "plantations",
    topicIndexCollection
  );
  const geojson = toFeatureCollection(plantations.places);
  return { plantations, geojson };
};

const IndividualPlantations = () => {
  const { plantations, geojson } = useLoaderData<typeof loader>();
  const [activePlace, setActivePlace] = useState<ESRelatedPlace | undefined>();
  const [hoveredPlace, setHoveredPlace] = useState<
    ESRelatedPlace | undefined
  >();
  const [noTrackMouse, setNoTrackMouse] = useState<boolean>(false);

  return (
    <PlaceContext.Provider
      value={{
        place: plantations,
        activePlace,
        setActivePlace,
        hoveredPlace,
        setHoveredPlace,
        noTrackMouse,
        setNoTrackMouse,
      }}
    >
      <div className="min-h-screen bg-gray-100">
        <header
          className="bg-cover bg-center text-white py-32 relative"
          style={{
            backgroundImage:
              "url('https://wp.georgiacoastatlas.org/wp-content/uploads/2024/11/ashley-knedler-9SW9IvKD9OY-unsplash-scaled.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <h1 className="relative z-10 text-6xl font-extrabold uppercase text-center my-4">
            Plantations
          </h1>
          <div className="relative p-10 rounded-lg shadow-md max-w-4xl mx-auto text-center z-10 bg-activeIsland">
            <p className="text-lg mt-4">intro here</p>
          </div>
        </header>

        <main className="py-16 px-6 lg:px-20 space-y-16 bg-activeIsland">
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 h-[600px] mb-12">
            <div className="bg-white rounded-lg">
              <RelatedPlacesDetailedList />
            </div>
            <div className="relative overflow-hidden rounded-lg lg:col-span-2">
              <RelatedPlacesMap geojson={geojson}>
                <Map className="w-full h-[600px] border-0" />
              </RelatedPlacesMap>
            </div>
          </section>

          <section className="rounded-lg overflow-hidden bg-white">
            <RelatedSection
              title="Articles"
              defaultOpen={false}
              className=""
              headerClassName="uppercase bg-water/75 p-6"
              bodyClassName="bg-white p-6"
            >
              <p>List of articles.</p>
            </RelatedSection>
            <RelatedSection
              title="Monographs"
              defaultOpen={false}
              className=""
              headerClassName="uppercase bg-water/75 p-6"
              bodyClassName="bg-white p-6"
            >
              <p>List of monographs.</p>
            </RelatedSection>
            <RelatedSection
              title="Media"
              defaultOpen={false}
              className=""
              headerClassName="uppercase bg-water/75 p-6"
              bodyClassName="bg-white p-6"
            >
              <p>List of media.</p>
            </RelatedSection>
          </section>
        </main>
      </div>
    </PlaceContext.Provider>
  );
};

export default IndividualPlantations;
