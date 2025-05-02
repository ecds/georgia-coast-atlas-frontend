import type {
  FeatureCollection,
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
} from "geojson";
import type { LabeledIIIFExternalWebResource } from "@samvera/clover-iiif/image";
import type { ImageService } from "@iiif/presentation-3";

export type Geometry =
  | Point
  | MultiPoint
  | LineString
  | MultiLineString
  | Polygon
  | MultiPolygon;

export type TUserDefinedField = {
  [key: string]: {
    label: string;
    value: string;
  };
} | null;

type TIIIFLabel = {
  [key: string]: string[];
};

// type TIIIFService = {
//   id: string;
//   type: string;
//   profile: string;
// };

export type TIIIFBody = LabeledIIIFExternalWebResource & {
  service: ImageService[];
};

type TAnnotation = {
  id: string;
  type: "Annotation";
  motivation: string;
  body: TIIIFBody;
};

type TAnnotationPage = {
  id: string;
  type: "AnnotationPage";
  items: TAnnotation[];
};

type TCanvas = {
  id: string;
  type: "Canvas";
  width: number;
  height: number;
  label: TIIIFLabel;
  items: TAnnotationPage[];
};

export type TIIIFManifest = {
  "@context": string[];
  id: string;
  type: "Manifest";
  items: TCanvas[];
  label: TIIIFLabel;
};

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

export type TPhotograph = {
  full: string;
  thumb: string;
  body: TIIIFBody;
  name: string;
};

type TCoordinates = [number, number];

export type TTopoName =
  | "Altamaha_Sound"
  | "Bladen"
  | "Bluffton"
  | "Boons_Lake"
  | "Boulogne"
  | "Browntown"
  | "Brunswick_East"
  | "Brunswick_West"
  | "Bug_Island"
  | "Burnt_Fort"
  | "Burroughs"
  | "Cabretta_Inlet"
  | "Claxton"
  | "Cox"
  | "Cumberland_Island_North"
  | "Cumberland_Island_South"
  | "Daisy"
  | "Darien"
  | "Deans_Crossing"
  | "Doboy_Sound"
  | "Doctortown"
  | "Dorchester"
  | "Dover_Bluff"
  | "East_of_Ludowici"
  | "Eden"
  | "Eulonia"
  | "Everett"
  | "Fernandina_Beach"
  | "Fort_Pulaski"
  | "Garden_City"
  | "Glennville"
  | "Glennville_NE"
  | "Glennville_SE"
  | "Glennville_SW"
  | "Glissons_Millpond"
  | "Gross"
  | "Groveland"
  | "Harrietts_Bluff"
  | "Hilliard"
  | "Hilliard_NE"
  | "Hilton_Head"
  | "Hinesville"
  | "Hortense"
  | "Isle_of_Hope"
  | "Jekyll_Island"
  | "Jerusalem"
  | "Jesup_East"
  | "Jesup_NW"
  | "Jesup_West"
  | "Kings_Ferry"
  | "Kingsland"
  | "Kingsland_NE"
  | "Lanier"
  | "Letford"
  | "Limehouse"
  | "Limerick_NW"
  | "Limerick_SE"
  | "Ludowici"
  | "Manningtown"
  | "McKinnon"
  | "Meldrim"
  | "Meldrim_SE"
  | "Meldrim_SW"
  | "Nahunta"
  | "Oak_Level"
  | "Port_Wentworth"
  | "Pritchardville"
  | "Raccoon_Key"
  | "Raccoon_Key_OE_S"
  | "Riceboro"
  | "Richmond_Hill"
  | "Ridgeville"
  | "Saint_Catherines_Sound"
  | "Saint_Marys"
  | "Sapelo_Sound"
  | "Savannah"
  | "Sea_Island"
  | "Seabrook"
  | "Shellman_Bluff"
  | "Sterling"
  | "Tarboro"
  | "Taylors_Creek"
  | "Thalmann"
  | "Townsend"
  | "Trinity"
  | "Tybee_Island_North"
  | "Tybee_Island_South"
  | "Walthourville"
  | "Wassaw_Sound"
  | "Wassaw_Sound_OE_S"
  | "Waverly"
  | "Waynesville"
  | "Willie"
  | "Woodbine";

export type TTopoYear =
  | "1917"
  | "1918"
  | "1919"
  | "1920"
  | "1921"
  | "1939"
  | "1942"
  | "1943"
  | "1944"
  | "1945"
  | "1947"
  | "1948"
  | "1950"
  | "1954"
  | "1955"
  | "1956"
  | "1957"
  | "1958"
  | "1959"
  | "1960"
  | "1961"
  | "1970"
  | "1975"
  | "1976"
  | "1977"
  | "1978"
  | "1979"
  | "1980"
  | "1981"
  | "1988"
  | "1993"
  | "1994"
  | "1997"
  | "1998"
  | "2011"
  | "2012"
  | "2014"
  | "2015"
  | "2017"
  | "2018"
  | "2020"
  | "2021"
  | "2024";

export type TTopoCoords = {
  resourceCoords: TCoordinates[];
  geoCoords: TCoordinates[];
};

export type TTopoCoordsRecord = {
  [key in TTopoName]: {
    [key in TTopoYear]: TTopoCoords;
  };
};

export type TBaseStyleName = "default" | "osm" | "satellite" | "usgs";

export type TBaseStyle = {
  name: TBaseStyleName;
  label: string;
  layers: string[];
};

export type TTypeColors = {
  [key: string]: {
    bgColor: string;
    textColor: string;
  };
};

export type TPlace = {
  geojson?: FeatureCollection;
  identifier: string;
  types: string[];
  name: string;
  county: string;
  description: string;
  location: {
    lon: number;
    lat: number;
  };
  uuid: string;
  slug: string;
};

export type TPlaceGeoJSON = {
  geojson: FeatureCollection;
};

export type TESHit = {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: TPlace;
};

export type TSearchFilter = {
  term: {
    types: string;
  };
};

export type TSearchQuery = {
  [key: string]: { query: string; fields: string[] };
};

export type TSearchOptions = {
  collection?: string;
  filter?: TSearchFilter[] | Array<undefined>;
  uuid?: string;
  query?: TSearchQuery | string;
  fields?: string[];
};
