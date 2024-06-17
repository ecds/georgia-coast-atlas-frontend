import { useState } from "react";
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
import VideoEmbed from "./VideoEmbed";
import type { TVideoItem } from "~/types";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  video: TVideoItem;
}

const VideoModal = ({ children, video }: Props) => {
  console.log("🚀 ~ VideoModal ~ video:", video);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <>
      <button onClick={open}>{children}</button>
      <Transition appear show={isOpen}>
        <Dialog
          as="div"
          className="relative z-10 focus:outline-none"
          onClose={close}
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
                <DialogPanel className="w-full max-w-md md:max-w-4xl rounded-xl bg-white p-6">
                  <DialogTitle as="div" className="flex justify-between">
                    <h3 className="text-base/7 font-medium text-black">
                      {video.primary_name.name.name}
                    </h3>

                    <Button onClick={close}>
                      <FontAwesomeIcon icon={faCircleXmark} /> Close
                    </Button>
                  </DialogTitle>
                  <VideoEmbed video={video} />
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default VideoModal;
