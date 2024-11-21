import { FeatureCollection } from "geojson";

type TLonLat = {
  lon: number;
  lat: number;
};

export type ESRelatedPlace = {
  name: string;
  location: TLonLat;
  type: string;
  uuid: string;
  slug: string;
};

export type ESVideo = {
  featured: null | boolean;
  embed_url: string;
  provider: string;
  embed_id: string;
  name: string;
  thumbnail_url: string;
  uuid: string;
};

export type ESPhotograph = {
  featured: boolean | null;
  name: string;
  uuid: string;
};

export type ESManifests = {
  identifier: string;
  label: "combined" | "photographs";
};

export type ESPlace = {
  name: string;
  description: string;
  featured_photograph: string;
  featured_video: ESVideo;
  identifier: string;
  types: string[];
  county: string;
  places: ESRelatedPlace[];
  videos: ESVideo[];
  photographs: ESPhotograph[];
  location: TLonLat;
  uuid: string;
  slug: string;
  manifests: ESManifests[];
  geojson: FeatureCollection;
};
