import type { SearchSettingsConfig } from "searchkit";

export const MapsSearch: SearchSettingsConfig = {
  search_attributes: [
    {
      field: "names",
      weight: 10,
    },
  ],
  result_attributes: [
    "name",
    "places",
    "thumbnail_url",
    "wms_resource",
    "slug",
    "year",
  ],
  facet_attributes: [{ attribute: "places", field: "places", type: "string" }],
  sorting: { default: [{ field: "year", order: "asc" }] },
};
