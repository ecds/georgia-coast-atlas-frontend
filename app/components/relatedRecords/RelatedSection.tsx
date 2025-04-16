import { useContext } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import Heading from "../layout/Heading";
import { PlaceContext } from "~/contexts";
import type { ReactNode } from "react";

interface Props {
  bodyClassName?: string;
  children: ReactNode;
  className?: string;
  collapsable?: boolean;
  defaultOpen?: boolean;
  toggleClassName?: string;
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
  toggleClassName,
  nested = false,
  title,
}: Props) => {
  const { relatedClosed } = useContext(PlaceContext);

  return (
    <div className={className ?? "w-full mx-auto border-t-2"}>
      <Disclosure
        as="div"
        className={className ?? "py-6"}
        // TODO: There has to be a better way.
        defaultOpen={relatedClosed ? false : defaultOpen}
      >
        {({ open }) => (
          <>
            <DisclosureButton
              className={`group flex w-full items-center justify-between ${toggleClassName}`}
              disabled={!collapsable}
            >
              <Heading
                as={nested ? "h3" : "h2"}
                className={`font-medium text-black/80 group-data-[hover]:text-black/60 truncate ${headerClassName}`}
              >
                {title}
              </Heading>
              <FontAwesomeIcon
                icon={open ? faMinus : faPlus}
                className="size-5 text-black/80 group-data-[hover]:fill-black/60"
              />
            </DisclosureButton>
            <DisclosurePanel
              transition
              unmount={false}
              className={`text-sm/5 origin-top transition duration-200 ease-out data-[closed]:opacity-0 ${bodyClassName}`}
            >
              {children}
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </div>
    // </div>
  );
};

export default RelatedSection;
