import { useEffect } from "react";
import { NavLink } from "@remix-run/react";
import "maplibre-gl/dist/maplibre-gl.css";
import Loading from "~/components/layout/Loading";

export default function Index() {
  useEffect(() => {
    // Add the no-scroll class when the component is mounted
    document.body.classList.add("no-scroll");

    // Clean up by removing the no-scroll class when the component is unmounted
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/stcatherinesflyover.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay to improve readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-5xl font-bold mb-8">Welcome to the Georgia Coast Atlas</h1>
        <p className="text-xl max-w-3xl mb-8">
          The Georgia coast, approximately 100 miles long, is defined by its
          barrier islands and their back-barrier environments. With a variety of
          life in maritime forests, salt marshes, tidal channels and creeks,
          back-dune meadows, coastal dunes, beaches, and offshore environments,
          the barrier islands and their back barrier environments are
          biologically rich.
        </p>

        {/* Buttons */}
        <div className="space-x-4">
          <NavLink
            to="/explore"
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md text-lg"
          >
            Explore the Coast
          </NavLink>
          <NavLink
            to="/search"
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md text-lg"
          >
            Search by Place
          </NavLink>
        </div>
      </div>
    </div>
  );
}
