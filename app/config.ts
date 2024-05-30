import type { TCoreDataRelatedEndpoints } from "./types";

export const islands = [
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
    slug: "st-catherines",
    label: "St. Catherine's",
    coreDataId: "643bf294-badc-486b-8644-84209c49735b",
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

export const coreDataRelatedEndpoints: TCoreDataRelatedEndpoints[] = [
  {
    endpoint: "media_contents",
    uiLabel: "Related Media & Documents",
    types: [
      {
        uuid: "0fbeaac4-45a3-4767-b9bc-7674632a8be1",
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
        uuid: "005cba1d-1d0e-4ab0-855d-57884d9db2b0",
        type: "county",
        uiLabel: "County",
      },
      {
        uuid: "2a9bcd0d-36a1-4c1a-b9af-55db56c243e1",
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
        uuid: "dc00ae2f-e12f-4bc8-934e-97bad18e5237",
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
        uuid: "2eaaf83f-98f0-4402-b3bc-92b185fcbaa4",
        type: "topo",
        uiLabel: "Topo",
      },
      {
        uuid: "d23eb32a-4157-48f9-bfe8-fc981600a4f8",
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
  typesense: "xyz",
  coreDataProject: 1,
};
