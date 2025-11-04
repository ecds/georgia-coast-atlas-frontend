import type { SearchSettingsConfig } from "searchkit";

export const AllPlacesSearch: SearchSettingsConfig = {
  search_attributes: [
    {
      field: "names",
      weight: 10,
    },
    {
      field: "types",
      weight: 2,
    },
    "description",
  ],
  result_attributes: [
    "county",
    "description",
    "featured_photograph",
    "identifier",
    "identifiers",
    "location",
    "media_types",
    "name",
    "names",
    "slug",
    "types",
    "uuid",
  ],
  facet_attributes: [
    { attribute: "types", field: "types", type: "string" },
    { attribute: "county", field: "county", type: "string" },
    { attribute: "media_types", field: "media_types", type: "string" },
  ],
  geo_attribute: "location",
  sorting: {
    default: {
      field: "_score",
      order: "desc",
    },
  },
};
