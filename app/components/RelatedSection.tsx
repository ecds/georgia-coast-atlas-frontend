import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  title: string;
}

const RelatedSection = ({ children, title }: Props) => {
  return (
    <div className="w-full px-4">
      <div className="mx-auto w-full border-t-2">
        <Disclosure as="div" className="p-6" defaultOpen={true}>
          <DisclosureButton className="group flex w-full items-center justify-between">
            <span className="font-medium text-black group-data-[hover]:text-black/80">
              {title}
            </span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="size-5 fill-black/60 group-data-[hover]:fill-black/50 transition-transform duration-700 group-data-[open]:rotate-180"
            />
          </DisclosureButton>
          <DisclosurePanel
            transition
            className="mt-2 text-sm/5 origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
          >
            {children}
          </DisclosurePanel>
        </Disclosure>
      </div>
    </div>
  );
};

export default RelatedSection;
