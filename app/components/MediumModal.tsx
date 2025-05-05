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
import IIIFViewer from "./layout/IIIFViewer.client";
import MediumThumbnail from "./MediumThumbnail";
import { RelatedMediaContext } from "~/contexts";
import ClientOnly from "./ClientOnly";
import type { ReactNode } from "react";
import type { ESRelatedMedium } from "~/esTypes";

interface Props {
  children: ReactNode;
  medium: ESRelatedMedium;
  media: ESRelatedMedium[];
}

const MediumViewer = () => {
  const { activeMedium } = useContext(RelatedMediaContext);

  if (!activeMedium) return null;

  if (activeMedium.media_type == "photograph") {
    return (
      <ClientOnly>
        <IIIFViewer photo={activeMedium} />
      </ClientOnly>
    );
  }
  return (
    <div className="relative pb-[56.25%] h-0 overflow-hidden max-w-full">
      <iframe
        className="absolute t-0 l-0 h-full w-full"
        src={activeMedium.embed_url}
        title={activeMedium.name}
        allowFullScreen
      />
    </div>
  );
};

const MediumModal = ({ children, medium, media }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { activeMedium, setActiveMedium } = useContext(RelatedMediaContext);

  const open = () => {
    setIsOpen(true);
    setActiveMedium(medium);
  };
  const close = () => {
    setIsOpen(false);
    setActiveMedium(undefined);
  };

  return (
    <>
      <button onClick={open}>{children}</button>
      <Transition appear show={isOpen}>
        <Dialog
          as="div"
          className="relative z-50 focus:outline-none"
          onClose={close}
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 z-[100] w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="w-full max-w-md md:max-w-4xl rounded-xl bg-white p-6">
                  <DialogTitle as="div" className="flex justify-between">
                    <h3 className="text-base/7 font-medium text-black">
                      {medium.name}
                    </h3>

                    <Button onClick={close}>
                      <FontAwesomeIcon icon={faCircleXmark} /> Close
                    </Button>
                  </DialogTitle>
                  <MediumViewer />
                  {media.length > 1 && (
                    <Carousel
                      showArrows
                      scrollDistance="slide"
                      wrapMode="wrap"
                      initialPage={
                        activeMedium ? media.indexOf(activeMedium) - 2 : 0
                      }
                    >
                      {media.map((medium) => {
                        return (
                          <button
                            key={`carousel-${medium.uuid}`}
                            className={`mt-2 rounded-md ${medium.media_type === "pano" ? "" : "w-32 h-32"} ${medium === activeMedium ? "bg-water/25" : ""}`}
                            onClick={() => setActiveMedium(medium)}
                          >
                            <MediumThumbnail
                              medium={medium}
                              captionClassName="text-sm truncate text-left"
                              figureClassName={`${medium.media_type === "pano" ? "mx-4 my-2" : "scale-75"} w-32 max-h-32`}
                            />
                          </button>
                        );
                      })}
                    </Carousel>
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

export default MediumModal;
