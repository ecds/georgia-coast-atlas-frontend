import { LngLat, LngLatBounds } from "maplibre-gl";

export const boundingBoxFromSearchParameters = (
  searchParams: string | undefined
) => {
  if (!searchParams) return;

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

export const boundingBoxFromLngLat = (lngLat: {
  _sw: { lng: number; lat: number };
  _ne: { lng: number; lat: number };
}) => {
  return new LngLatBounds(
    Object.values(lngLat._sw) as [number, number],
    Object.values(lngLat._ne) as [number, number]
  );
};
