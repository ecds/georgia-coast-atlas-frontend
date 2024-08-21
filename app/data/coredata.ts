import { coreDataRelatedEndpoints, dataHosts, keys } from "~/config";
import type { TCoreDataPlace } from "~/types";

export const fetchRelatedRecords = async (id: string) => {
  const relatedRecords = {};
  for (const related of coreDataRelatedEndpoints) {
    const relatedResponse = await fetch(
      `https://${dataHosts.coreData}/core_data/public/v1/places/${id}/${related.endpoint}?project_ids=${keys.coreDataProject}&per_page=2000`,
    );
    const relatedData = await relatedResponse.json();
    const items = relatedData[related.endpoint];
    for (const item of items) {
      for (const value of Object.values(item.user_defined)) {
        // @ts-ignore
        item[(value.label as string).toLowerCase()] = value.value;
        console.log("🚀 ~ fetchRelatedRecords ~ item:", item);
      }
    }
    // @ts-ignore
    relatedRecords[related.endpoint] = Object.groupBy(
      items,
      // @ts-ignore
      ({ project_model_relationship_uuid }) =>
        // @ts-ignore
        related.types.find((t) => t.uuid == project_model_relationship_uuid)
          .type,
    );
  }
  return relatedRecords;
};

export const fetchPlaceRecord = async (id: string) => {
  if (!id) return null;

  const response = await fetch(
    `https://${dataHosts.coreData}/core_data/public/v1/places/${id}?project_ids=1`,
  );
  const data: TCoreDataPlace = await response.json();
  if (data && data.place.user_defined) {
    for (const value of Object.values(data.place.user_defined)) {
      data.place[value.label.toLowerCase()] = value.value;
    }
    const photographAssoc = coreDataRelatedEndpoints
      ?.find((e) => e?.endpoint == "media_contents")
      ?.types.find((t) => t?.type == "photographs")?.uuid;
    data.place.iiif_manifest = `https://${dataHosts.coreData}/core_data/public/v1/places/${data.place.uuid}/manifests/${photographAssoc}`;
  }
  return data;
};
