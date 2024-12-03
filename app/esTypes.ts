import type { FeatureCollection } from "geojson";

type TLonLat = {
  lon: number;
  lat: number;
};

export type ESRelatedPlace = {
  description: string;
  location: TLonLat;
  name: string;
  slug: string;
  type: string;
  uuid: string;
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

export type ESTopoLayer = {
  name: string;
  url: string;
  uuid: string;
};

export type ESTopo = {
  year: string;
  layers: ESTopoLayer[];
};

export type ESMapLayer = {
  preview: string;
  wms_resource: string;
  uuid: string;
  name: string;
};

export type ESPlace = {
  bbox: [number, number, number, number];
  county: string;
  description: string;
  featured_photograph: string;
  featured_video: ESVideo;
  geojson: FeatureCollection;
  identifier: string;
  manifests: ESManifests[];
  map_layers: ESMapLayer[];
  name: string;
  location: TLonLat;
  photographs: ESPhotograph[];
  places: ESRelatedPlace[];
  related_videos?: ESVideo[];
  short_description: string;
  slug: string;
  topos: ESTopo[];
  types: string[];
  uuid: string;
  videos: ESVideo[];
};
