import { coreDataRelatedEndpoints, dataHosts, keys } from "~/config";
import type { TCoreDataPlace } from "~/types";

export const fetchRelatedRecords = async (id: string) => {
  const relatedRecords = {};
  for (const related of coreDataRelatedEndpoints) {
    const relatedResponse = await fetch(
      `https://${dataHosts.coreData}/core_data/public/v1/places/${id}/${related.endpoint}?project_ids=${keys.coreDataProject}`,
    );
    const relatedData = await relatedResponse.json();
    const items = relatedData[related.endpoint];
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
  // @ts-ignore
  if (data.place.user_defined) {
    // @ts-ignore
    for await (const userDefined of Object.keys(data.place.user_defined)) {
      // @ts-ignore
      data.place[data.place.user_defined[userDefined].label] =
        // @ts-ignore
        data.place.user_defined[userDefined].value;
    }
  }
  return data;
};
