import type { FeatureCollection } from "geojson";
import type { ReactNode } from "react";
import type { InstantSearchServerState } from "react-instantsearch";

export type TLonLat = {
  lon: number;
  lat: number;
};

export type ESRelatedPlace = {
  description: string;
  identifiers: TWebIdentifier[];
  location: TLonLat;
  name: string;
  featured_photograph?: string;
  slug: string;
  type: string;
  types?: string[];
  uuid: string;
};

export type ESRelatedMedium = {
  description: string;
  full_url: string;
  embed_url: string;
  featured: boolean | undefined;
  info?: string;
  media_type: "pano" | "photograph" | "video";
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
  bbox: [number, number, number, number];
  preview: string;
  wms_resources: string[];
  uuid: string;
  name: string;
};

type TWebIdentifier = {
  authority: "viaf" | "wikidata" | "geonames";
  identifier: string;
};

export type ESPlace = {
  bbox: [number, number, number, number];
  county: string;
  date_modified?: string;
  description: string;
  featured_photograph?: string;
  featured_video?: ESRelatedMedium;
  geojson: FeatureCollection;
  identifier: string;
  identifiers?: TWebIdentifier[];
  manifests: ESManifests[];
  map_layers: ESMapItem[];
  name: string;
  names?: string[];
  location: TLonLat;
  other_places: ESRelatedPlace[];
  panos?: ESRelatedMedium[];
  photographs?: ESRelatedMedium[];
  places: ESRelatedPlace[];
  short_description: string;
  slug: string;
  topos?: ESTopo[];
  type: string;
  types: string[];
  uuid: string;
  videos?: ESRelatedMedium[];
};

export type ESTopic = {
  map_layers?: ESMapItem[];
  name: string;
  photographs?: ESRelatedMedium[];
  places?: ESRelatedPlace[];
  slug: string;
  uuid: string;
  videos?: ESRelatedMedium[];
  wordpress_id: number | undefined;
};

type ESCollectionItem = {
  description: string;
  name: string;
  location: TLonLat;
  places: string[];
  slug: string;
  thumbnail_url: string;
  title?: string;
  uuid: string;
};

export type ESMapItem = ESCollectionItem & {
  bbox: [number, number, number, number];
  bearing?: number;
  date: string;
  name: string;
  preview: string;
  wms_resources: string[];
};

export type ESSearchProps = {
  serverState?: InstantSearchServerState;
  serverUrl?: string;
  location?: Location;
  modalOpen?: boolean;
  children?: ReactNode;
  total?: number;
};

export type ESPhotographItem = ESCollectionItem & {
  alt?: string;
  manifest: string;
};

export type CollectionType = "maps" | "photographs" | "panos" | "videos";
