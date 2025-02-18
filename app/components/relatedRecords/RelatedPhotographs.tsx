import { useContext, useEffect, useState } from "react";
import { GalleryContext, PlaceContext } from "~/contexts";
import RelatedSection from "./RelatedSection";
import PhotographModal from "../PhotographModal";
import type { TIIIFManifest, TIIIFBody, TPhotograph } from "~/types";
import type { ESManifests } from "~/esTypes";

const RelatedPhotographs = () => {
  const { place, full } = useContext(PlaceContext);
  const [manifest, setManifest] = useState<ESManifests>();
  const [photographs, setPhotographs] = useState<TPhotograph[]>();
  const [activePhotograph, setActivePhotograph] = useState<TIIIFBody>();

  useEffect(() => {
    const manifestLabel = full ? "combined" : "photographs";
    setManifest(
      place.manifests.find(
        (placeManifest) => placeManifest.label === manifestLabel
      )
    );
  }, [place, full]);

  useEffect(() => {
    const fetchIIIF = async () => {
      if (!manifest) return;
      const response = await fetch(manifest.identifier);
      const data: TIIIFManifest = await response.json();
      setPhotographs(
        data.items.map((item) => {
          return {
            full: `${item.items[0].items[0].body.service[0].id}/full/max/0/default.jpg`,
            thumb: `${item.items[0].items[0].body.service[0].id}/square/150,/0/default.jpg`,
            body: {
              ...item.items[0].items[0].body,
              width: item.width,
              height: item.height,
            },
            item,
            name: item.label.en[0],
          };
        })
      );
    };
    if (manifest) fetchIIIF();
  }, [manifest]);

  useEffect(() => {
    if (!photographs || photographs.length === 0) return;
    setActivePhotograph(photographs[0].body);
  }, [photographs]);

  if (photographs && photographs.length > 0) {
    return (
      <RelatedSection title="Photographs">
        <div className="flex flex-wrap justify-around">
          {photographs && (
            <GalleryContext.Provider
              value={{ activePhotograph, setActivePhotograph }}
            >
              {photographs.map((photo) => {
                return (
                  <PhotographModal
                    key={`related-photo-${photo.name}-${photo.body.id}`}
                    photographs={photographs}
                    photograph={photo}
                  >
                    <figure className="md:my-8 md:mr-8 max-w-xs">
                      <img
                        src={photo.thumb}
                        alt=""
                        className="drop-shadow-md h-auto md:h-32 w-full md:w-auto m-auto"
                      />
                      <span className="sr-only">Select image</span>
                    </figure>
                  </PhotographModal>
                );
              })}
            </GalleryContext.Provider>
          )}
        </div>
      </RelatedSection>
    );
  }

  return null;
};

export default RelatedPhotographs;
