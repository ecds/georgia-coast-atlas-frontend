import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

const FacetDisclosure = ({ title, children }: Props) => {
  return (
    <Disclosure>
      <DisclosureButton className="group flex w-full items-center justify-between">
        <span className="font-medium text-black group-data-[hover]:text-black/80">
          {title}
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className="size-5 transition-transform fill-black/60 group-data-[hover]:fill-black/50 group-data-[open]:rotate-180"
        />
      </DisclosureButton>
      <DisclosurePanel
        transition
        className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
      >
        {children}
      </DisclosurePanel>
    </Disclosure>
  );
};

export default FacetDisclosure;
