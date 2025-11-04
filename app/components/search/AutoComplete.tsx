// The props you can use in your component to interact with Autocomplete
import {
  faClose,
  faSearch,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchBox, useSearchBox } from "react-instantsearch";
import { useEffect, type ReactNode } from "react";

const ButtonComponent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={`absolute top-2.5 text-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 ${className ?? ""}`}
    >
      {children}
    </span>
  );
};

const SubmitComponent = () => {
  return (
    <ButtonComponent className="start-0">
      <FontAwesomeIcon icon={faSearch} />
    </ButtonComponent>
  );
};

const ResetComponent = () => {
  return (
    <ButtonComponent className="end-0">
      <FontAwesomeIcon icon={faClose} />
    </ButtonComponent>
  );
};

const LoadingComponent = () => {
  return (
    <div
      className={`absolute z-10 h-screen w-[33vw] bg-white/70 -top-8 -left-5 flex items-center justify-center`}
    >
      <FontAwesomeIcon icon={faSpinner} spin className="text-6xl relative" />
    </div>
  );
};

export function Autocomplete() {
  const { query, refine } = useSearchBox();

  useEffect(() => {
    // console.log("🚀 ~ SearchResult ~ query, refine:", query, refine);
  }, [query, refine]);

  return (
    <SearchBox
      searchAsYouType={true}
      resetIconComponent={ResetComponent}
      submitIconComponent={SubmitComponent}
      loadingIconComponent={LoadingComponent}
      placeholder="Search Places"
      classNames={{
        root: "px-4",
        form: "relative h-16",
        input:
          "block w-full p-4 mt-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-200 focus:ring-blue-500 focus:border-blue-500 appearance-none",
        // resetIcon: "hidden",
      }}
    />
  );
}
