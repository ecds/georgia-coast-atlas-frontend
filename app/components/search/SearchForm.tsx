import { SearchBox } from "react-instantsearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faSearch,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import type { ReactNode } from "react";

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
    <ButtonComponent className="end-2.5">
      <FontAwesomeIcon icon={faSearch} />
    </ButtonComponent>
  );
};

const ResetComponent = () => {
  return (
    <ButtonComponent className="end-8">
      <FontAwesomeIcon icon={faClose} />
    </ButtonComponent>
  );
};

const LoadingComponent = () => {
  return (
    <ButtonComponent className="end-8">
      <FontAwesomeIcon icon={faSpinner} spin className="text-xl" />
    </ButtonComponent>
  );
};

const SearchForm = () => {
  return (
    <SearchBox
      resetIconComponent={ResetComponent}
      submitIconComponent={SubmitComponent}
      loadingIconComponent={LoadingComponent}
      placeholder="Search Places"
      classNames={{
        root: "px-8 sticky top-0",
        form: "max-w-md relative h-16",
        input:
          "block w-full p-4 mt-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 appearance-none",
        resetIcon: "hidden",
      }}
    />
  );
};

export default SearchForm;
