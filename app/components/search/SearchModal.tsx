import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useEffect, useRef, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";
import { Form, useLocation } from "react-router";
import type { FormEvent } from "react";
import { useSearchBox } from "react-instantsearch";
import { SearchModalContext } from "~/contexts";


interface SearchModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function SearchModal({ isOpen, setIsOpen }: SearchModalProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [hasQuery, setHasQuery] = useState<boolean>(false);
  const { query, refine } = useSearchBox();
  const { searchModalOpen, setSearchModalOpen } = useContext(SearchModalContext);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(Boolean(!query) && Boolean(!location.search));

    // return () => {
    //   refine("");
    // };
  }, [setIsOpen, query, location]);

  useEffect(() => {
    if (!searchModalOpen) {
      setHasQuery(false);
      if (searchInputRef.current) searchInputRef.current.value = "";
    }
  }, [searchModalOpen]);

  // const closeModal = () => {
  //   setIsOpen(false);
  // };

  const navigateToSearch = () => {
    if (searchInputRef.current) {
      refine(searchInputRef.current.value);
      setSearchModalOpen(false);
      // navigate(
      //   encodeURI(
      //     `/search?${indexCollection}[query]=${searchInputRef.current.value}`
      //   ),
      //   {
      //     replace: true,
      //   }
      // );
    }
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    navigateToSearch();
  };

  const handleChange = () => {
    if (searchInputRef.current?.value)
      setHasQuery(searchInputRef.current.value !== "");
  };

  return (
    <Dialog
      as="div"
      className="fixed inset-0 flex w-screen items-center justify-center bg-black/60 z-50 p-4 transition duration-300 ease-in origin-center data-[closed]:opacity-0"
      transition
      open={searchModalOpen}
      onClose={() => setSearchModalOpen(false)}
    >
      <DialogPanel
        transition
        className={`w-full max-w-2xl space-y-4 bg-white rounded-md text-center transition-transform origin-center duration-300 ease-in data-[closed]:scale-95`}
      >
        <div className="flex w-full items-end flex-row-reverse pt-2 pr-2">
          <button
            className="flex flex-col text-black/70 hover:text-black  border border-black/40 px-1 rounded-md items-center text-xs"
            onClick={() => setSearchModalOpen(false)}
          >
            <FontAwesomeIcon icon={faClose} className="h-4" /> close
          </button>
        </div>
        <div className=" px-12 pb-12 ">
          <DialogTitle className="font-bold leading-tight text-gray-900 mb-6 text-center flex">
            <span className="text-4xl flex-grow">Search by Place</span>
          </DialogTitle>
          <Description>
            The Search by Place section covers thousands of points of interest
            along the entire 100-mile coastline and inland counties. Use the
            Filter button
            <span className="w-full h-14 bg-blue-100 text-blue-800 font-medium mx-2 px-2.5 py-0.5 rounded">
              <FontAwesomeIcon icon={faFilter} />
            </span>
            next to the search bar to refine by type. Click any place on the map
            or in the results to learn more.{" "}
          </Description>
          <Form reloadDocument onSubmit={handleSearch} className="mt-4">
            <input
              ref={searchInputRef}
              type="search"
              onChange={handleChange}
              className="p-2 border-2 rounded-sm border-black/50"
              placeholder="Search Places"
            />{" "}
            <button
              type="submit"
              className="p-2 bg-costal-green text-gray-100 font-medium rounded uppercase"
            >
              {hasQuery ? (
                <>
                  <FontAwesomeIcon icon={faSearch} /> search
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faClose} /> close
                </>
              )}
            </button>
          </Form>
        </div>
      </DialogPanel>
    </Dialog>
  );
}
