import {
  coreDataRelatedEndpoints,
  dataHosts,
  keys,
  modelFieldUUIDs,
} from "~/config";
import type { TCoreDataPlace, TPlaceRecord } from "~/types";

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

  const data: { place: TPlaceRecord } = await response.json();
  const placeData: TPlaceRecord = data.place;

  if (placeData && placeData.user_defined) {
    for (const value of Object.values(placeData.user_defined)) {
      placeData[value.label.toLowerCase()] = value.value;
    }

    placeData.iiif_manifest = `https://${dataHosts.coreData}/core_data/public/v1/places/${data.place.uuid}/manifests/${modelFieldUUIDs.photographs}`;
  }

  return placeData;
};
