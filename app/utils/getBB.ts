import { LngLat, LngLatBounds } from "maplibre-gl";

export const getBB = (searchParams: string) => {
  const regex = /.*boundingBox]=(.*)\d/;
  if (regex.test(decodeURI(searchParams))) {
    const result = regex.exec(decodeURI(searchParams));
    if (result && result.length > 1 && result[1]) {
      const coordinates = result[1].split("%2C").map((num) => parseFloat(num));
      if (
        coordinates.every((num) => typeof num === "number") &&
        coordinates.length === 4
      ) {
        const ne = new LngLat(coordinates[1], coordinates[0]);
        const sw = new LngLat(coordinates[3], coordinates[2]);
        return new LngLatBounds(sw, ne);
      }
    }
  }
  return undefined;
};
