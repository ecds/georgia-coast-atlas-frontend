import { SearchBox, SortBy } from "react-instantsearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faClose,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import FacetMenu from "./FacetMenu";
import CurrentRefinements from "./CurrentRefinements";
import { indexCollection, topBarHeight } from "~/config";
import { type ReactNode } from "react";

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
      className={`absolute z-10 h-screen w-[33vw] bg-white/70 -top-[${topBarHeight}] -left-5 flex items-center justify-center`}
    >
      <FontAwesomeIcon icon={faSpinner} spin className="text-6xl relative" />
    </div>
  );
};

const SearchForm = () => {
  return (
    <div className="grid grid-cols-5 sticky top-0 bg-white shadow-md">
      <SearchBox
        resetIconComponent={ResetComponent}
        submitIconComponent={SubmitComponent}
        loadingIconComponent={LoadingComponent}
        placeholder="Search Places"
        classNames={{
          root: "px-4 col-span-4",
          form: "max-w-md relative h-16",
          input:
            "block w-full p-4 mt-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-200 focus:ring-blue-500 focus:border-blue-500 appearance-none",
          resetIcon: "hidden",
        }}
      />
      <div className="py-4 pe-8 col-span-1">
        <FacetMenu />
      </div>
      <div className="col-span-5">
        <CurrentRefinements />
        <SortBy
          items={[
            {
              label: "Name",
              value: indexCollection,
            },
            { label: "Relevance", value: `${indexCollection}_score` },
          ]}
        />
      </div>
    </div>
  );
};

export default SearchForm;
