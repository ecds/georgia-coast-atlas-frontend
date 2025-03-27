import type { FeatureCollection } from "geojson";
import type { InstantSearchServerState } from "react-instantsearch";

export type TLonLat = {
  lon: number;
  lat: number;
};

export type ESRelatedPlace = {
  description: string;
  location: TLonLat;
  name: string;
  slug: string;
  type: string;
  types?: string[];
  uuid: string;
  preview?: string;
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

type ESRelatedPhotograph = {
  featured: boolean | null;
  name: string;
  uuid: string;
  full_url: string;
  thumbnail_url: string;
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

export type ESPano = {
  description: string;
  embed_url: string;
  name: string;
  places?: ESRelatedPlace[];
  place_names?: string[];
  publisher?: string;
  location?: TLonLat;
  slug: string;
  title?: string;
  thumbnail_url: string;
  uuid?: string;
};

type TWebIdentifier = {
  authority: "viaf" | "wikidata" | "geonames";
  identifier: string;
};

export type ESPlace = {
  bbox: [number, number, number, number];
  county: string;
  date_modified: string;
  description: string;
  featured_photograph: string;
  featured_video: ESVideo;
  geojson: FeatureCollection;
  identifier: string;
  identifiers: TWebIdentifier[];
  manifests: ESManifests[];
  map_layers: ESMapLayer[];
  name: string;
  names: string[];
  location: TLonLat;
  other_places: ESRelatedPlace[];
  panos?: ESPano[];
  photographs: ESRelatedPhotograph[];
  places: ESRelatedPlace[];
  short_description: string;
  slug: string;
  topos: ESTopo[];
  type: string;
  types: string[];
  uuid: string;
  videos: ESVideo[];
};

export type ESMapItem = {
  name: string;
  bbox: [number, number, number, number];
  wms_resource: string;
  places: ESRelatedPlace[];
  description: string;
  date: string;
  uuid: string;
  preview: string;
};

export type ESSearchProps = {
  serverState?: InstantSearchServerState;
  serverUrl?: string;
  location?: Location;
  modalOpen?: boolean;
};

export type ESPhotographItem = {
  alt?: string;
  description?: string;
  full_url: string;
  manifest: string;
  name: string;
  places: string[];
  slug: string;
  title?: string;
  thumbnail_rul: string;
  uuid: string;
};
