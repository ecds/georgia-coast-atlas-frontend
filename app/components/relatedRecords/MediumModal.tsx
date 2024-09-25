import { useContext, useState } from "react";
import { ModalContext } from "~/contexts";
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
import type { ReactNode } from "react";
import Heading from "../layout/Heading";

interface ModalProps {
  children: ReactNode;
  title: string;
}

export const MediumModalButton = ({ children }: { children: ReactNode }) => {
  const { open } = useContext(ModalContext);
  return <button onClick={open}>{children}</button>;
};

export const MediumModalDialog = ({ children, title }: ModalProps) => {
  const { isOpen, close } = useContext(ModalContext);

  return (
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
                  <Heading
                    as="h3"
                    className="text-base/7 font-medium text-black"
                  >
                    {title}
                  </Heading>

                  <Button onClick={close}>
                    <FontAwesomeIcon icon={faCircleXmark} /> Close
                  </Button>
                </DialogTitle>
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export const MediumModal = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </ModalContext.Provider>
  );
};
