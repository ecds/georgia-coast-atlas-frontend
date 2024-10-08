import {
  coreDataRelatedEndpoints,
  dataHosts,
  keys,
  modelFieldUUIDs,
} from "~/config";
import type { TPlaceRecord } from "~/types";

export const fetchRelatedRecord = async (id: string, endpoint: string) => {
  const relatedResponse = await fetch(
    `https://${dataHosts.coreData}/core_data/public/v1/places/${id}/${endpoint}?project_ids=${keys.coreDataProject}&per_page=2000`
  );

  return await relatedResponse.json();
};

export const fetchRelatedRecords = async (id: string) => {
  const relatedRecords = {
    places: [],
    media_contents: [],
    items: [],
    taxonomies: [],
  };
  for (const related of coreDataRelatedEndpoints) {
    const relatedData = await fetchRelatedRecord(id, related.endpoint);
    const items = relatedData[related.endpoint];

    for (const item of items) {
      for (const value of Object.values(item.user_defined)) {
        // @ts-ignore
        item[(value.label as string).toLowerCase()] = value.value;
      }
    }
    try {
      // @ts-ignore
      relatedRecords[related.endpoint] = Object.groupBy(
        items,
        // @ts-ignore
        ({ project_model_relationship_uuid }) =>
          // @ts-ignore
          related.types.find((t) => t.uuid == project_model_relationship_uuid)
            .type
      );
    } catch {
      // If a record doesn't have any of a type, an error gets thrown.
    }
  }
  return relatedRecords;
};

export const fetchPlaceRecord = async (id: string) => {
  if (!id) return null;

  const response = await fetch(
    `https://${dataHosts.coreData}/core_data/public/v1/places/${id}?project_ids=1`
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

export const fetchPlaceRecordByIdentifier = async (identifier: string) => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const body = JSON.stringify({
    searches: [
      {
        query_by: "378d2b43-dcc0-4b64-8ef9-ecd7d743e2fb",
        collection: "gca",
        per_page: 1,
        q: identifier,
        page: 1,
        highlight_fields: "none",
        exclude_fields: `${modelFieldUUIDs.county},${modelFieldUUIDs.relatedPlaces},${modelFieldUUIDs.photographs},${modelFieldUUIDs.mapLayers},${modelFieldUUIDs.topoQuads}`,
      },
    ],
  });

  const response = await fetch(
    `https://${dataHosts.typesense}/multi_search?x-typesense-api-key=${keys.typesense}`,
    {
      method: "POST",
      headers,
      body,
      redirect: "follow",
    }
  );

  const data = await response.json();

  const placeID = data.results[0].hits[0].document.uuid;

  if (!placeID) return;

  const placeRecord = await fetchPlaceRecord(placeID);
  return placeRecord as TPlaceRecord;
};
