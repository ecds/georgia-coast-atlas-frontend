import type {
  AnnotationPage,
  PlaceFeatureProperties,
} from "@peripleo/peripleo";

export interface UserDefinedField {
  label: string;
  value: string;
}

export interface CoreDataProperties extends PlaceFeatureProperties {
  record_id: string;
  uuid: string;
}

export interface Geometry {
  type: "Point" | "MultiPoint";
  coordinates: [number, number];
}

export interface CoreDataPlaceProperties extends Place<CoreDataProperties> {
  ccode: [];
  title: string;
}

export interface CoreDataPlace {
  "@id": string;
  type: "Place";
  properties: CoreDataPlaceProperties;
  geometry: Geometry;
  names: [{ [key: string]: string }];
  user_defined?: { [key: string]: UserDefinedField };
  place_layers: string[];
}

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
