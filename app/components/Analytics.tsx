import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

const Analytics = () => {
  const location = useLocation();
  const trackerRef = useRef<HTMLImageElement>(null);
  const [key, setKey] = useState<string | undefined>(undefined);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    setKey(location.key);
    trackerRef.current?.setAttribute(
      "src",
      "https://matomo.ecdsdev.org/matomo.php?idsite=52&rec=1"
    );
  }, [location]);

  if (process.env.NODE_ENV == "production" && isMounted) {
    return (
      <img
        ref={trackerRef}
        alt=""
        src=""
        className="border-0 height-0"
        id={key}
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }
  return null;
};

export default Analytics;
