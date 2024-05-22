import { coreDataRelatedEndpoints, dataHosts, keys } from "~/config";
import type { v4 as uuid4 } from "@types/uuid";
import type { TCoreDataPlace } from "~/types";

export const fetchRelatedRecords = async (id: uuid4) => {
  const relatedRecords = {};
  for (const related of coreDataRelatedEndpoints) {
    const relatedResponse = await fetch(
      `https://${dataHosts.coreData}/core_data/public/v1/places/${id}/${related.endpoint}?project_ids=${keys.coreDataProject}`
    );
    const relatedData = await relatedResponse.json();
    const items = relatedData[related.endpoint];
    relatedRecords[related.endpoint] = Object.groupBy(
      items,
      ({ project_model_relationship_uuid }) =>
        related.types.find((t) => t.uuid == project_model_relationship_uuid)
          .type
    );
  }
  return relatedRecords;
};

export const fetchPlaceRecord = async (id: uuid4) => {
  if (!id) return null;

  const response = await fetch(
    `https://${dataHosts.coreData}/core_data/public/v1/places/${id}?project_ids=1`
  );
  const data: TCoreDataPlace = await response.json();
  if (data.place.user_defined) {
    for await (const userDefined of Object.keys(data.place.user_defined)) {
      data.place[data.place.user_defined[userDefined].label] =
        data.place.user_defined[userDefined].value;
    }
  }
  return data;
};