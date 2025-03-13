import type { SearchSettingsConfig } from "searchkit";

export const PhotoSearch: SearchSettingsConfig = {
  search_attributes: [
    {
      field: "names",
      weight: 10,
    },
  ],
  result_attributes: [
    "manifest",
    "name",
    "places",
    "slug",
    "thumbnail_url",
    "uuid",
  ],
  facet_attributes: [{ attribute: "places", field: "places", type: "string" }],
  sorting: { default: [{ field: "slug", order: "asc" }] },
};
