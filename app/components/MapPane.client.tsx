import { MapDraw } from "@performant-software/geospatial";
import geoData from "~/data/all.json";
const MapPane = () => {
  const action = () => {};
  return (
    <MapDraw
      data={geoData}
      mapStyle={`https://api.maptiler.com/maps/dataviz/style.json?key=uXfXuebPlkoPXiY3TPcv`}
      onChange={action("onChange")}
      style={{ height: "100vh" }}
    />
  );
};

export default MapPane;
