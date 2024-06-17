import type { Geometry, FeatureCollection } from "geojson";

type TNames = {
  name: string;
  primary: boolean;
};

type TCoreDataSourceName = {
  id: number;
  primary: boolean;
  name: {
    id: number;
    name: string;
  };
};

type TUserDefinedField = {
  [key: string]: {
    label: string;
    value: string;
  };
} | null;

export type TCoreDataPlaceRecord = {
  uuid: string;
  name: string;
  place_names: TNames[];
  place_layers: [];
  web_identifiers: [];
  place_geometry: {
    geometry_json: Geometry;
  };
  user_defined: TUserDefinedField;
  description?: string;
  identifier?: string;
  [key: string]: any;
  iiif_manifest: string;
};

export type TCoreDataPlace = {
  place: TCoreDataPlaceRecord;
} | null;

export type TCoreDataImage = {
  content_type: "image/jpeg";
  content_url: string;
  content_download_url: string;
  content_iiif_url: string;
  content_inline_url: string;
  content_preview_url: string;
  content_thumbnail_url: string;
  manifest_url: string;
  project_model_relationship_uuid: string;
  project_model_relationship_inverse: boolean;
  user_defined: TUserDefinedField;
  uuid: string;
  name: string;
};

type TMediaContents = {
  photographs: TCoreDataImage[];
};

type TCoreDataTaxonomies = {
  project_model_relationship_uuid: string;
  project_model_relationship_inverse: boolean;
  user_defined: TUserDefinedField;
  uuid: string;
  name: string;
};

type TCoreDataItem = {
  project_model_relationship_uuid: string;
  project_model_relationship_inverse: boolean;
  user_defined: TUserDefinedField;
  uuid: string;
  primary_name: {
    id: number;
    primary: boolean;
    name: {
      id: number;
      name: string;
    };
  };
  source_titles: TCoreDataSourceName[];
};

export type TVideoItem = TCoreDataItem & {
  embed_id: string;
  provider: "Vimeo" | "YouTube";
};

type TThumbnail = {
  format: string;
  height: number;
  id: string;
  type: string;
  width: number;
};

export interface IIIFCollection {
  id: string;
  item_count: number;
  label: {
    [lang: string]: string[];
  };
  thumbnail: TThumbnail[];
  type: string;
}

export type TWordPressData = {
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
};

type TRelatedRecord = {
  id: string;
  name: string;
  names: string[];
  names_facet: string[];
  record_id: string;
  uuid: string;
  geometry?: Geometry;
  coordinates: number[];
};

export interface Document extends TRelatedRecord {
  "005cba1d-1d0e-4ab0-855d-57884d9db2b0": TRelatedRecord[];
  "2eaaf83f-98f0-4402-b3bc-92b185fcbaa4": TRelatedRecord[];
  "dc00ae2f-e12f-4bc8-934e-97bad18e5237": TRelatedRecord[];
  "378d2b43-dcc0-4b64-8ef9-ecd7d743e2fb": string;
  "dec90162-73fd-4a02-8079-a215c9a8300b": string;
}

export interface SearchResult {
  results: Document[];
}

type TIslandSlug = "ossabaw" | "sapelo" | "st-catherines" | "wassaw" | "wolf";
type TIslandLabel =
  | "Ossabaw"
  | "Sapelo"
  | "St. Catherine's"
  | "Wassaw"
  | "Wolf";

export type TIslandConfig = {
  slug: TIslandSlug;
  label: TIslandLabel;
  coreDataId: string;
};

export type TIslandServerData = {
  island: TIslandConfig;
  place: TCoreDataPlaceRecord;
};

export type TRelatedCoreDataRecords = {
  media_contents?: TMediaContents;
  places?: {
    county: TCoreDataPlaceRecord;
    relatedPlaces: TCoreDataPlaceRecord[];
  };
  taxonomies?: TCoreDataTaxonomies[];
  items?: {
    topo: TCoreDataItem;
    videos: TVideoItem[];
  };
};

export type TIslandClientData = TIslandServerData &
  TRelatedCoreDataRecords & {
    wpData: TWordPressData;
    geoJSON: FeatureCollection;
  };

type TRelatedType = {
  uuid: string;
  type: string;
  uiLabel: string;
};

export type TCoreDataRelatedEndpoints = {
  endpoint: string;
  uiLabel: string;
  types: TRelatedType[];
};
