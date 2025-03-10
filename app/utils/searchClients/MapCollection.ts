import type { SearchSettingsConfig } from "searchkit";

export const MapsSearch: SearchSettingsConfig = {
  search_attributes: [
    {
      field: "names",
      weight: 10,
    },
  ],
  result_attributes: ["name", "places", "preview_link", "wms_resource", "slug"],
  facet_attributes: [{ attribute: "places", field: "places", type: "string" }],
};
