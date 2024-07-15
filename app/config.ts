import type { TCoreDataRelatedEndpoints } from "./types";

export const islands = [
  {
    slug: "blackbeard",
    label: "Blackbeard",
    coreDataId: "c4e43063-179b-5807-a191-6e1438170486",
  },
  {
    slug: "cumberland",
    label: "Cumberland",
    coreDataId: "ab536bff-55c5-50d5-b06f-2be190dd88a4",
  },
  {
    slug: "jekyll",
    label: "Jekyll",
    coreDataId: "aa8a4b3b-febb-52fd-acaf-7e5f73ba1426",
  },
  {
    slug: "little-saint-simons",
    label: "Little Saint Simons",
    coreDataId: "e0a98bec-543b-47c7-a00b-b3f509dde77f",
  },
  {
    slug: "ossabaw",
    label: "Ossabaw",
    coreDataId: "79b2c613-a9f7-4e1e-b795-0faeed53c827",
  },
  {
    slug: "sapelo",
    label: "Sapelo",
    coreDataId: "75fc9ef3-7a0b-4856-83dd-ea8c574eef5f",
  },
  {
    slug: "saint-catherines",
    label: "Saint. Catherine's",
    coreDataId: "643bf294-badc-486b-8644-84209c49735b",
  },
  {
    slug: "saint-simons",
    label: "Saint Simons",
    coreDataId: "8c113813-f475-42b9-bcfa-4915d24009a9",
  },
  {
    slug: "tybee",
    label: "Tybee Island",
    coreDataId: "532b46db-0bf7-486b-b055-3b852ee6d21f",
  },
  {
    slug: "wassaw",
    label: "Wassaw",
    coreDataId: "46c9700b-2dfa-4aed-81e6-50d81c168401",
  },
  {
    slug: "wolf",
    label: "Wolf",
    coreDataId: "dcec5413-40a6-418a-b5f5-db04e183cf96",
  },
];

export const modelFieldUUIDs = {
  county: "005cba1d-1d0e-4ab0-855d-57884d9db2b0",
  description: "159c8717-703e-40c5-a813-425578f9a8a7",
  identifier: "378d2b43-dcc0-4b64-8ef9-ecd7d743e2fb",
  kml: "dec90162-73fd-4a02-8079-a215c9a8300b",
  photographs: "0fbeaac4-45a3-4767-b9bc-7674632a8be1",
  relatedPlaces: "2a9bcd0d-36a1-4c1a-b9af-55db56c243e1",
  topo: "2eaaf83f-98f0-4402-b3bc-92b185fcbaa4",
  types: "dc00ae2f-e12f-4bc8-934e-97bad18e5237",
  videos: "d23eb32a-4157-48f9-bfe8-fc981600a4f8",
};

export const coreDataRelatedEndpoints: TCoreDataRelatedEndpoints[] = [
  {
    endpoint: "media_contents",
    uiLabel: "Related Media & Documents",
    types: [
      {
        uuid: modelFieldUUIDs.photographs,
        type: "photographs",
        uiLabel: "Photographs",
      },
    ],
  },
  {
    endpoint: "places",
    uiLabel: "Related Places",
    types: [
      {
        uuid: modelFieldUUIDs.county,
        type: "county",
        uiLabel: "County",
      },
      {
        uuid: modelFieldUUIDs.relatedPlaces,
        type: "relatedPlaces",
        uiLabel: "Related Places",
      },
    ],
  },
  {
    endpoint: "taxonomies",
    uiLabel: "Taxonomies",
    types: [
      {
        uuid: modelFieldUUIDs.types,
        type: "type",
        uiLabel: "Type",
      },
    ],
  },
  {
    endpoint: "items",
    uiLabel: "Items",
    types: [
      {
        uuid: modelFieldUUIDs.topo,
        type: "topo",
        uiLabel: "Topo",
      },
      {
        uuid: modelFieldUUIDs.videos,
        type: "videos",
        uiLabel: "Videos",
      },
    ],
  },
];

export const dataHosts = {
  coreData: "coredata.ecdsdev.org",
  wordPress: "wp.georgiacoastatlas.org",
};

export const keys = {
  typesense: "67d9b8d2810cc3a174eb949067",
  coreDataProject: 1,
};

export const topBarHeight = "5rem";
