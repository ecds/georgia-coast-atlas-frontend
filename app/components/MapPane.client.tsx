import { useEffect, useMemo, useState } from "react";
import { toFeature } from "@peripleo/peripleo";
import { MapDraw } from "@performant-software/geospatial";
import type { CoreDataPlace } from "~/types";
interface Props {
  place: CoreDataPlace;
}

const MapPane = ({ place }: Props) => {
  const [feature, setFeature] = useState();

  useMemo(() => {
    setFeature(toFeature(place));
  }, [place]);

  useEffect(() => {
    console.log("🚀 ~ MapPane ~ feature:", feature);
  }, [feature]);

  const action = () => {};

  return (
    <MapDraw
      data={feature}
      mapStyle={`https://api.maptiler.com/maps/dataviz/style.json?key=uXfXuebPlkoPXiY3TPcv`}
      onChange={action("onChange")}
      style={{ height: "100vh" }}
    />
  );
};

export default MapPane;
