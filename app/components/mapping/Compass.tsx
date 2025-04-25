import { useContext, useEffect, useState } from "react";
import { MapContext } from "~/contexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

const Compass = () => {
  const { map } = useContext(MapContext);
  const [bearing, setBearing] = useState<number>();

  useEffect(() => {
    if (!map) return;
    const updateBearing = () => {
      setBearing(map.getBearing() * -1);
    };
    map.on("rotate", updateBearing);

    return () => {
      map.off("rotate", updateBearing);
    };
  }, [map]);

  const resetBearing = () => {
    map?.rotateTo(0);
  };

  return (
    <button
      className="flex flex-col items-center absolute top-24 right-4 bg-white w-12 p-1 rounded-full shadow-md disabled:cursor-default"
      style={{ transform: `rotate(${bearing}deg)` }}
      onClick={resetBearing}
      disabled={map ? Math.abs(map?.getBearing() * 1) == 0 : false}
    >
      <FontAwesomeIcon className="inline-block" icon={faArrowUp} />
      <span className="inline-block">N</span>
      <span className="sr-only">Toggle layer menu</span>
    </button>
  );
};

export default Compass;
