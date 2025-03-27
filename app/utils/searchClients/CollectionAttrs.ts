const baseAttrs = [
  "description",
  "identifiers",
  "name",
  "place_names",
  "places",
  "publisher",
  "locations",
  "slug",
  "thumbnail_url",
  "uuid",
];
export const mapAttrs = {
  result_attributes: [...baseAttrs, "date", "manifest", "wms_resource"],
};

export const panoAttrs = {
  result_attributes: [...baseAttrs, "embed_url", "title"],
};

export const photoAttrs = {
  result_attributes: [...baseAttrs, "alt", "manifest", "title"],
};

export const videoAttrs = {
  result_attributes: [...baseAttrs, "embed_url"],
};
