import { useEffect, useState } from "react";
import RelatedSection from "./RelatedSection";
import PhotographModal from "./PhotographModal";
import type { TIIIFManifest, TIIIFBody } from "~/types";

interface Props {
  manifest: string;
}

const RelatedPhotographs = ({ manifest }: Props) => {
  const [photographs, setPhotographs] =
    useState<{ full: string; thumb: string; body: TIIIFBody }[]>();
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
                  <figure>
                    <img
                      src={photo.thumb}
                      alt=""
                      className="p-8 drop-shadow-md h-auto md:h-48 w-full md:w-auto"
                    />
                    <span className="sr-only">Select image</span>
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