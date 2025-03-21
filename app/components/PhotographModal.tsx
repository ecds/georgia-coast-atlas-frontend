import { useContext, useState } from "react";
import { Carousel } from "nuka-carousel";
import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { ClientOnly } from "remix-utils/client-only";
import { GalleryContext } from "~/contexts";
import OpenSeadragonViewer from "./OpenseadragonViewer.client";
import type { ReactNode } from "react";
import type { TPhotograph } from "~/types";

interface Props {
  children: ReactNode;
  photographs: TPhotograph[];
  photograph: TPhotograph;
}

const PhotographModal = ({ children, photographs, photograph }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { setActivePhotograph } = useContext(GalleryContext);

  const handleClick = () => {
    setActivePhotograph(photograph.body);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={handleClick}>{children}</button>
      <Transition appear show={isOpen}>
        <Dialog
          as="div"
          className="relative z-50 focus:outline-none"
          onClose={handleClose}
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="space-y-4 w-screen md:w-1/2 lg:w-[66vw] border bg-white p-6 rounded-xl">
                  <DialogTitle as="div" className="flex justify-between">
                    <h3 className="text-base/7 font-medium text-black">{""}</h3>

                    <Button onClick={handleClose}>
                      <FontAwesomeIcon icon={faCircleXmark} /> Close
                    </Button>
                  </DialogTitle>
                  {photographs && (
                    <div className="flex flex-col justify-between">
                      <div className="h-96">
                        <ClientOnly>{() => <OpenSeadragonViewer />}</ClientOnly>
                      </div>
                      {photographs.length > 1 && (
                        <Carousel showArrows scrollDistance="slide">
                          {photographs.map((photograph) => {
                            return (
                              <button
                                key={`thumb-${photograph.thumb}-${photograph.body.id}`}
                                onClick={() =>
                                  setActivePhotograph(photograph.body)
                                }
                                onKeyDown={({ key }) => {
                                  if (key === "Enter")
                                    setActivePhotograph(photograph.body);
                                }}
                              >
                                <figure className="p-8 w-48 text-wrap">
                                  <img
                                    className="drop-shadow-md"
                                    src={photograph.thumb}
                                    alt=""
                                  />
                                  <figcaption className="text-left text-sm pt-1 max-w-24 break-words">
                                    {photograph.name}
                                  </figcaption>
                                </figure>
                                <span className="sr-only">Select image</span>
                              </button>
                            );
                          })}
                        </Carousel>
                      )}
                    </div>
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default PhotographModal;
