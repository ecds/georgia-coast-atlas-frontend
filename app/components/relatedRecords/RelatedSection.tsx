import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useContext, type ReactNode } from "react";
import Heading from "../layout/Heading";
import { PlaceContext } from "~/contexts";

interface Props {
  children: ReactNode;
  title: string;
  defaultOpen?: boolean;
  nested?: boolean;
}

const RelatedSection = ({
  children,
  title,
  defaultOpen = true,
  nested = false,
}: Props) => {
  const { relatedClosed } = useContext(PlaceContext);

  return (
    <div className={`w-full ${nested ? "" : "px-4"}`}>
      <div className={`mx-auto w-full border-t-2`}>
        <Disclosure
          as="div"
          className={nested ? "py-4" : "p-6"}
          // TODO: There has to be a better way.
          defaultOpen={relatedClosed ? false : defaultOpen}
        >
          <DisclosureButton className="group flex w-full items-center justify-between">
            <Heading
              as={nested ? "h3" : "h2"}
              className={`font-medium text-black group-data-[hover]:text-black/80`}
            >
              {title}
            </Heading>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="size-5 fill-black/60 group-data-[hover]:fill-black/50 transition-transform duration-700 group-data-[open]:rotate-180"
            />
          </DisclosureButton>
          <DisclosurePanel
            transition
            unmount={false}
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
