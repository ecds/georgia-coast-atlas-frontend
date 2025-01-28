import Navbar from "~/components/layout/Navbar";
import { useState } from "react";

const Dropdown = ({
  title,
  children,
  isOpen,
  toggle,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  toggle: () => void;
}) => {
  return (
    <div className={`border-t-0 ${isOpen ? "border-gray-300" : ""}`}>
      <button
        onClick={toggle}
        className={`w-full text-left px-6 py-5 bg-[#94C1E1] text-xl font-bold uppercase flex justify-between items-center text-black`}
      >
        {isOpen ? "−" : "+"} {title}
      </button>

      {isOpen && (
        <div className="bg-white text-black px-6 py-5 text-lg">{children}</div>
      )}
    </div>
  );
};

const IndividualPlantations = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <header
        className="bg-cover bg-center text-white py-32 relative"
        style={{
          backgroundImage:
            "url('https://wp.georgiacoastatlas.org/wp-content/uploads/2024/11/ashley-knedler-9SW9IvKD9OY-unsplash-scaled.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <h1
          className="relative z-10 text-6xl font-extrabold uppercase text-center"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          Plantations
        </h1>
        <div
          className="relative p-10 rounded-lg shadow-md max-w-4xl mx-auto text-center z-10"
          style={{ backgroundColor: "#49674C" }}
        >
          <p className="text-lg mt-4">
            intro here
          </p>
        </div>
      </header>


      <main
        className="text-white py-16 px-6 lg:px-20 space-y-16"
        style={{ backgroundColor: "#49674C" }}
      >

        <section>
          <div className="relative overflow-hidden rounded-lg shadow-lg mb-12">
            <iframe
              src="https://dev.georgiacoastatlas.org/search?georgia_coast_places%5BrefinementList%5D%5Btypes%5D%5B0%5D=Plantation"
              className="w-full h-[600px] border-0"
              allowFullScreen
              title="Plantations Map"
            ></iframe>
          </div>
        </section>


        <section className="border border-gray-300 rounded-lg overflow-hidden">
          <Dropdown
            title="Articles"
            isOpen={openIndex === 0}
            toggle={() => toggleDropdown(0)}
          >
            <p>
                {/* add text here */}
            </p>
          </Dropdown>
          <Dropdown
            title="Monographs"
            isOpen={openIndex === 1}
            toggle={() => toggleDropdown(1)}
          >
            <p>
                {/* add text here */}
            </p>
          </Dropdown>
          <Dropdown
            title="Other Media"
            isOpen={openIndex === 2}
            toggle={() => toggleDropdown(2)}
          >
            <p>
                {/* add text here */}
            </p>
          </Dropdown>
        </section>
      </main>
    </div>
  );
};

export default IndividualPlantations;
