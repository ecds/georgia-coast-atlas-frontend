import { useEffect, useState } from "react";
import RelatedSection from "./RelatedSection";
import PhotographModal from "../PhotographModal";
import type { TIIIFManifest, TIIIFBody, TPhotograph } from "~/types";

interface Props {
  manifest: string;
}

const RelatedPhotographs = ({ manifest }: Props) => {
  const [photographs, setPhotographs] = useState<TPhotograph[]>();
  const [activePhotograph, setActivePhotograph] = useState<TIIIFBody>();

  useEffect(() => {
    const fetchIIIF = async () => {
      const response = await fetch(manifest);
      const data: TIIIFManifest = await response.json();
      setPhotographs(
        data.items.map((item) => {
          return {
            full: `${item.items[0].items[0].body.service[0].id}/full/max/0/default.jpg`,
            thumb: `${item.items[0].items[0].body.service[0].id}/square/150,/0/default.jpg`,
            body: item.items[0].items[0].body,
            name: item.label.en[0],
          };
        }),
      );
    };
    fetchIIIF();
  }, [manifest]);

  useEffect(() => {
    if (!photographs) return;
    setActivePhotograph(photographs[0].body);
  }, [photographs]);

  return (
    <RelatedSection title="Photographs">
      <div className="flex flex-wrap justify-around md:justify-start">
        {photographs && (
          <>
            {photographs.map((photo) => {
              return (
                <PhotographModal
                  key={photo.thumb}
                  activePhotograph={activePhotograph}
                  photographs={photographs}
                  setActivePhotograph={setActivePhotograph}
                  photograph={photo}
                >
                  <figure className="md:m-8 max-w-xs">
                    <img
                      src={photo.thumb}
                      alt=""
                      className="drop-shadow-md h-auto md:h-32 w-full md:w-auto m-auto"
                    />
                    <span className="sr-only">Select image</span>
                    {/* <figcaption className="md:w-32 text-left break-words text-sm pt-1">
                      {photo.name}
                    </figcaption> */}
                  </figure>
                </PhotographModal>
              );
            })}
          </>
        )}
      </div>
    </RelatedSection>
  );
};

export default RelatedPhotographs;
