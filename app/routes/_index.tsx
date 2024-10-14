import { NavLink } from "@remix-run/react";
import { useEffect } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

export default function Index() {
  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/stcatherinesflyover2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-1"></div>

      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-5xl font-bold mb-2 tracking-widest" style={{ fontFamily: 'Barlow, sans-serif' }}>
          WELCOME TO THE
        </h1>
        <h2 className="text-6xl font-bold mb-8 tracking-widest" style={{ fontFamily: 'Barlow, sans-serif' }}>
          GEORGIA COAST ATLAS
        </h2>
        <hr className="w-1/4 border-t-2 border-gray-300 mb-8" />
        <p className="text-lg max-w-3xl leading-relaxed mb-8" style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 400 }}>
          The Georgia coast, approximately 100 miles long, is defined by its
          barrier islands and their back-barrier environments. With a variety of
          life in maritime forests, salt marshes, tidal channels and creeks,
          back-dune meadows, coastal dunes, beaches, and offshore environments,
          the barrier islands and their back barrier environments are
          biologically rich. The seasonally subtropical climate of the islands,
          combined with large tidal fluxes, helps make Georgia salt marshes
          among the most biologically productive ecosystems in the world. The
          Georgia coast also holds nearly one-third of the salt marshes in the
          eastern U.S.
        </p>

        <div className="flex flex-row space-x-8">
          <NavLink
            to="/explore"
            className="bg-blue-300 hover:bg-blue-400 text-black font-bold py-3 px-6 rounded-md text-lg tracking-wide border border-gray-300"
            style={{ backgroundColor: '#98c1d9', color: '#333', fontFamily: 'Barlow, sans-serif', fontWeight: 600 }}
          >
            Explore the Coast
          </NavLink>
          <NavLink
            to="/search"
            className="bg-blue-300 hover:bg-blue-400 text-black font-bold py-3 px-6 rounded-md text-lg tracking-wide border border-gray-300"
            style={{ backgroundColor: '#98c1d9', color: '#333', fontFamily: 'Barlow, sans-serif', fontWeight: 600 }}
          >
            Search by Place
          </NavLink>
        </div>
      </div>
    </div>
  );
}
