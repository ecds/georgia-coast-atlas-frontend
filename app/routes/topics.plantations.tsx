import { useState } from "react";
import { fetchBySlug } from "~/data/coredata";
import { topicIndexCollection } from "~/config";
import { useLoaderData } from "@remix-run/react";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import { PlaceContext } from "~/contexts";
import RelatedPlacesDetailedList from "~/components/relatedRecords/RelatedPlacesDetailedList";
import RelatedPlacesMap from "~/components/relatedRecords/RelatedPlacesMap";
import Map from "~/components/mapping/Map.client";
import type { ESPlace, ESRelatedPlace } from "~/esTypes";

const Dropdown = ({
  title,
  children,
  isOpen,
  toggle,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  toggle: () => void;
}) => {
  return (
    <div className={`border-t-0 ${isOpen ? "border-gray-300" : ""}`}>
      <button
        onClick={toggle}
        className={`w-full text-left px-6 py-5 bg-water text-xl font-bold uppercase flex justify-between items-center text-black`}
      >
        {isOpen ? "-" : "+"} {title}
      </button>

      {isOpen && (
        <div className="bg-white text-black px-6 py-5 text-lg">{children}</div>
      )}
    </div>
  );
};

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activePlace, setActivePlace] = useState<ESRelatedPlace | undefined>();
  const [hoveredPlace, setHoveredPlace] = useState<
    ESRelatedPlace | undefined
  >();
  const [noTrackMouse, setNoTrackMouse] = useState<boolean>(false);

  const toggleDropdown = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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

          <section className="border border-gray-300 rounded-lg overflow-hidden">
            <Dropdown
              title="Articles"
              isOpen={openIndex === 0}
              toggle={() => toggleDropdown(0)}
            >
              <p>{/* add text here */}</p>
            </Dropdown>
            <Dropdown
              title="Monographs"
              isOpen={openIndex === 1}
              toggle={() => toggleDropdown(1)}
            >
              <p>{/* add text here */}</p>
            </Dropdown>
            <Dropdown
              title="Other Media"
              isOpen={openIndex === 2}
              toggle={() => toggleDropdown(2)}
            >
              <p>{/* add text here */}</p>
            </Dropdown>
          </section>
        </main>
      </div>
    </PlaceContext.Provider>
  );
};

export default IndividualPlantations;
