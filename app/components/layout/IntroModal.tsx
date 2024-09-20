import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface IntroModalProps {
  setIsOpen: (isOpen: boolean) => void;
}

export default function IntroModal({ setIsOpen }: IntroModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  function closeModal() {
    setIsOpen(false);
  }

  function handleSearch() {
    if (searchQuery.trim()) {
      closeModal();
      navigate(`/search?gca%5Bquery%5D=${encodeURIComponent(searchQuery)}`);
    }
  }

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-none bg-white p-6 text-left align-middle shadow-xl transition-all">
                <h1 className="text-4xl font-bold leading-tight text-gray-900 mb-6 text-center">
                  <span>WELCOME TO THE</span>
                  <br />
                  <span>GEORGIA COAST ATLAS</span>
                  <br />
                </h1>
                <hr className="border-gray-300 mb-4" />
                <div className="mt-2 text-center">
                  <p className="text-base text-gray-500">
                    The Georgia coast, approximately 100 miles long, is defined by its barrier islands and their back-barrier environments. With a variety of life in maritime forests, salt marshes, tidal channels and creeks, back-dune meadows, coastal dunes, beaches, and offshore environments, the barrier islands and their back barrier environments are biologically rich. The seasonally subtropical climate of the islands, combined with large tidal fluxes, helps make Georgia salt marshes among the most biologically productive ecosystems in the world. The Georgia coast also holds nearly one-third of the salt marshes in the eastern U.S.
                  </p>
                </div>
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
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}