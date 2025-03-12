import type { SearchSettingsConfig } from "searchkit";

export const VideoSearch: SearchSettingsConfig = {
  search_attributes: [
    {
      field: "names",
      weight: 10,
    },
  ],
  result_attributes: [
    "description",
    "embed_url",
    "name",
    "places",
    "slug",
    "thumbnail_url",
    "uuid",
  ],
  facet_attributes: [{ attribute: "places", field: "places", type: "string" }],
  sorting: { default: [{ field: "slug", order: "asc" }] },
};
