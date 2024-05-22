import type {
  AnnotationPage,
  PlaceFeatureProperties,
} from "@peripleo/peripleo";
import type { Geometry } from "@types/geojson";
import type { v4 as uuid4 } from "@types/uuid";

export interface CoreDataProperties extends PlaceFeatureProperties {
  record_id: string;
  uuid: string;
}

export interface CoreDataPlaceProperties extends Place<CoreDataProperties> {
  ccode: [];
  title: string;
}

type TNames = {
  name: string;
  primary: boolean;
};

type TUserDefinedField = {
  [key: uuid4]: {
    label: string;
    value: string;
  };
};

export type TCoreDataPlace = {
  place: {
    uuid: uuid4;
    name: string;
    place_names: TNames[];
    place_layers: [];
    web_identifiers: [];
    place_geometry: {
      geometry_json: Geometry;
    };
    user_defined: TUserDefinedField;
  };
};

export interface IIIFCollection {
  id: string;
  item_count: number;
  label: {
    [lang: string]: string[];
  };
  thumbnail: Thumbnail[];
  type: string;
}

export interface Thumbnail {
  format: string;
  height: number;
  id: string;
  type: string;
  width: number;
}

export interface RelatedMedia extends AnnotationPage {}

export interface WordPressData {
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
}

interface RelatedRecord {
  id: uuid4;
  name: string;
  names: string[];
  names_facet: string[];
  record_id: string;
  uuid: uuid4;
  geometry?: Geometry;
  coordinates: number[];
}

export interface Document extends RelatedRecord {
  [key: "005cba1d-1d0e-4ab0-855d-57884d9db2b0"]: TRelatedRecord[];
  [key: "2eaaf83f-98f0-4402-b3bc-92b185fcbaa4"]: TRelatedRecord[];
  [key: "dc00ae2f-e12f-4bc8-934e-97bad18e5237"]: TRelatedRecord[];
  [key: "378d2b43-dcc0-4b64-8ef9-ecd7d743e2fb"]: string;
  [key: "dec90162-73fd-4a02-8079-a215c9a8300b"]: string;
}

export interface SearchResult {
  results: Document[];
}
