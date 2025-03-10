import type { SearchSettingsConfig } from "searchkit";

export const PanosSearch: SearchSettingsConfig = {
  search_attributes: [
    {
      field: "names",
      weight: 10,
    },
  ],
  result_attributes: ["name", "places", "link", "uuid", "slug"],
  facet_attributes: [{ attribute: "places", field: "places", type: "string" }],
  sorting: { default: [{ field: "slug", order: "asc" }] },
};
