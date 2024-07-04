import { SearchBox } from "react-instantsearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faClose } from "@fortawesome/free-solid-svg-icons";
import type { ReactNode } from "react";
import FacetMenu from "./FacetMenu";

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
    <div className="absolute z-10 h-screen bg-white/50 w-full top-0">
      {/* <FontAwesomeIcon
        icon={faSpinner}
        spin
        className="text-xl relative top-[50%] left-[50%]"
      /> */}
    </div>
  );
};

const SearchForm = () => {
  return (
    <div className="flex">
      <SearchBox
        resetIconComponent={ResetComponent}
        submitIconComponent={SubmitComponent}
        loadingIconComponent={LoadingComponent}
        placeholder="Search Places"
        classNames={{
          root: "ps-8 pe-4 sticky top-0 grow",
          form: "max-w-md relative h-16",
          input:
            "block w-full p-4 mt-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 appearance-none",
          resetIcon: "hidden",
        }}
      />
      <div className="py-4 pe-8">
        <FacetMenu />
      </div>
    </div>
  );
};

export default SearchForm;
