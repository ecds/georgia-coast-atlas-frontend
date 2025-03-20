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
  bodyClassName?: string;
  children: ReactNode;
  className?: string;
  collapsable?: boolean;
  defaultOpen?: boolean;
  headerClassName?: string;
  nested?: boolean;
  title: string;
}

const RelatedSection = ({
  bodyClassName,
  children,
  className,
  collapsable = true,
  defaultOpen = true,
  headerClassName,
  nested = false,
  title,
}: Props) => {
  const { relatedClosed } = useContext(PlaceContext);

  return (
    <div className={className ?? "w-full mx-auto border-t-2"}>
      <Disclosure
        as="div"
        className="py-6"
        // TODO: There has to be a better way.
        defaultOpen={relatedClosed ? false : defaultOpen}
      >
        <DisclosureButton
          className={`group flex w-full items-center justify-between ${headerClassName}`}
          disabled={!collapsable}
        >
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
          className={`text-sm/5 origin-top transition duration-200 ease-out data-[closed]:opacity-0 ${bodyClassName}`}
        >
          {children}
        </DisclosurePanel>
      </Disclosure>
    </div>
    // </div>
  );
};

export default RelatedSection;
