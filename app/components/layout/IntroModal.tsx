// TODO: Make this a wrapper component for both the explore and search modals.
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { indexCollection } from "~/config";

interface IntroModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function IntroModal({ isOpen, setIsOpen }: IntroModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  function closeModal() {
    setIsOpen(false);
  }

  function handleSearch() {
    if (searchQuery.trim()) {
      closeModal();
      navigate(encodeURI(`/search?${indexCollection}[query]=${searchQuery}`));
    }
  }

  return (
    <Dialog
      as="div"
      className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-in origin-center data-[closed]:opacity-0"
      transition
      open={isOpen}
      onClose={closeModal}
    >
      <DialogPanel
        transition
        className={`max-w-xl space-y-4 bg-white/60 p-12 rounded-md text-center transition-transform origin-center duration-300 ease-in data-[closed]:scale-95`}
      >
        <DialogTitle
          as="h2"
          className="text-4xl font-bold leading-tight text-gray-900 mb-6 text-center"
        >
          <span className="block">WELCOME TO THE</span>
          <span className="block">GEORGIA COAST ATLAS</span>
        </DialogTitle>
        <hr className="border-gray-300 mb-4" />
        <p className="mt-2 text-center text-base text-gray-700">
          In this section of the Atlas, discover curated points of interest
          across the main barrier islands and six inland counties. Click any
          highlighted area to begin exploring.
        </p>
        <hr className="border-gray-300 my-4" />
        <div className="flex justify-center items-center mb-4">
          <button
            type="button"
            className="inline-flex justify-center rounded-full bg-black/80 px-8 py-4 text-base font-medium text-white hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
            onClick={closeModal}
          >
            Explore the Coast
          </button>
          <span className="text-gray-500 mx-2">OR</span>
          <div className="relative flex items-center">
            <input
              type="text"
              id="search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-10 py-2.5"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <button
              type="button"
              className="absolute right-2 inline-flex justify-center items-center rounded-full bg-black/80 p-2 text-base font-medium text-white hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
              onClick={handleSearch}
              aria-label="Search"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  );
}
