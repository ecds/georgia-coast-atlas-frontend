import { MapDraw } from "@performant-software/geospatial";
import type { TCoreDataPlace } from "~/types";
interface Props {
  record: TCoreDataPlace;
}

const MapPane = ({ record }: Props) => {

  return (
    <MapDraw
      data={record.place_geometry.geometry_json}
      mapStyle={`https://api.maptiler.com/maps/dataviz/style.json?key=uXfXuebPlkoPXiY3TPcv`}
      onChange={() => {}}
      style={{ height: "100vh" }}
    />
  );
};

export default MapPane;
