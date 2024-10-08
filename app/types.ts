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
import type { SourceSpecification } from "maplibre-gl";

export type Geometry =
  | Point
  | MultiPoint
  | LineString
  | MultiLineString
  | Polygon
  | MultiPolygon;

type GeometryCollection = {
  geometries: Geometry[];
  type: "GeometryCollection";
};

type GeometryJSON = {
  geometry_json: Geometry | GeometryCollection;
};

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

export type TCoreDataLayer = {
  id: string;
  name: TTopoYear | string;
  url: string;
  layer_type: "georeference" | "raster";
  placeName?: string;
};

export type TCoreDataPlace = {
  uuid: string;
  name: string;
  place_names: TNames[];
  place_layers: TCoreDataLayer[];
  web_identifiers: [];
  place_geometry: GeometryJSON;
  user_defined: TUserDefinedField;
};

export type TPlaceRecord = TCoreDataPlace & {
  uuid: string;
  name: string;
  place_names: TNames[];
  place_layers: TCoreDataLayer[];
  web_identifiers: [];
  place_geometry: Geometry | GeometryCollection | GeometryJSON;
  user_defined: TUserDefinedField;
  description?: string;
  identifier?: string;
  [key: string]: any;
  iiif_manifest: string;
};

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
  id: TIslandSlug;
  label: TIslandLabel;
  coreDataId: string;
};

export type TIslandServerData = {
  island: TIslandConfig;
  place: TPlaceRecord;
};

export type TRelatedPlaceRecord = {
  project_model_relationship_uuid: string;
  project_model_relationship_inverse: boolean;
  user_defined: TUserDefinedField;
  identifier?: string;
  description?: string;
  uuid: string;
  name: string;
  place_geometry: GeometryJSON;
};

// export type TRelatedEndpoint =
//   | "media_contents"
//   | "places"
//   | "taxonomies"
//   | "items";

export type TRelatedCoreDataRecords = {
  media_contents?: TMediaContents;
  places?: {
    county: TRelatedPlaceRecord;
    relatedPlaces: TRelatedPlaceRecord[];
    topoQuads: TRelatedPlaceRecord[];
    mapLayers: TRelatedPlaceRecord[];
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
    maps: any;
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

export type TPhotograph = {
  full: string;
  thumb: string;
  body: TIIIFBody;
  name: string;
};

export type TTypeHit = {
  id: string;
  inverse: boolean;
  name: string;
  name_facet: string;
  record_id: string | number;
  uuid: string;
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

export type TStyleSource = {
  source: string;
  label: string;
  id: string;
};

export type TPlaceSource = {
  [key: string]: SourceSpecification;
};

export type TBaseStyleName = "default" | "satellite" | "usgs";

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
