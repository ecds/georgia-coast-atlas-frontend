const baseAttrs = [
  "description",
  "identifiers",
  "name",
  "place_names",
  "places.name",
  "publisher",
  "location",
  "locations",
  "slug",
  "thumbnail_url",
  "uuid",
];
export const mapAttrs = {
  result_attributes: [...baseAttrs, "date", "manifest", "wms_resources"],
};

export const panoAttrs = {
  result_attributes: [...baseAttrs, "embed_url", "title"],
};

export const photoAttrs = {
  result_attributes: [...baseAttrs, "alt", "manifest", "title"],
};

export const videoAttrs = {
  result_attributes: [...baseAttrs, "embed_url", "category"],
};
