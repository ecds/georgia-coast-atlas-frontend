import type { SearchSettingsConfig } from "searchkit";

export const MapsSearch: SearchSettingsConfig = {
  search_attributes: [
    {
      field: "names",
      weight: 10,
    },
  ],
  result_attributes: [
    "date",
    "manifest",
    "name",
    "places",
    "thumbnail_url",
    "wms_resource",
    "slug",
  ],
  facet_attributes: [{ attribute: "places", field: "places", type: "string" }],
  sorting: { default: [{ field: "date", order: "asc" }] },
};
