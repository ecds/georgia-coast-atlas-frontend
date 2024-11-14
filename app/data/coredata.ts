import {
  coreDataRelatedEndpoints,
  dataHosts,
  indexCollection,
  keys,
  modelFieldUUIDs,
} from "~/config";
import type {
  TPlaceRecord,
  TPlace,
  TESHit,
  TPlaceGeoJSON,
  TSearchOptions,
} from "~/types";

const elasticSearchHeaders = () => {
  const esHeaders = new Headers();
  esHeaders.append("authorization", `ApiKey ${keys.elasticsearch}`);
  esHeaders.append("Content-Type", "application/json");
  return esHeaders;
};

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

export const fetchPlaceBySlug = async (slug: string | undefined) => {
  if (!slug) return undefined;
  const body = {
    query: {
      simple_query_string: { query: slug, fields: ["slug"] },
    },
    size: 1,
    from: 0,
    _source: {
      includes: [
        "name",
        "description",
        "county",
        "uuid",
        "location",
        "types",
        "identifier",
        "geojson",
        "slug",
        "manifest",
      ],
    },
  };

  const response = await fetch(
    `${dataHosts.elasticSearch}/${indexCollection}/_search`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: elasticSearchHeaders(),
    }
  );

  const data = await response.json();
  const place: TPlace = data.hits.hits.map((hit: TESHit) => hit._source)[0];
  return place;
};

export const fetchPlacesByType = async (type: string) => {
  const body = {
    query: {
      bool: {
        filter: [
          {
            term: {
              types: "Barrier Island",
            },
          },
        ],
        must: {
          match_all: {},
        },
      },
    },
    size: 250,
    from: 0,
    _source: {
      includes: [
        "name",
        "description",
        "county",
        "uuid",
        "location",
        "types",
        "identifier",
        "slug",
      ],
    },
  };

  const response = await fetch(
    `${dataHosts.elasticSearch}/${indexCollection}/_search`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: elasticSearchHeaders(),
    }
  );

  const data = await response.json();
  const places: TPlace[] = data.hits.hits.map((hit: TESHit) => hit._source);
  return places;
};

export const fetchPlacesGeoJSON = async ({
  collection = indexCollection,
  filter = [],
}: TSearchOptions) => {
  const body = {
    query: {
      bool: {
        filter,
        must: {
          match_all: {},
        },
      },
    },
    size: 250,
    from: 0,
    _source: {
      includes: ["geojson"],
    },
  };

  const response = await fetch(
    `${dataHosts.elasticSearch}/${collection}/_search`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: elasticSearchHeaders(),
    }
  );

  const data = await response.json();
  const places: TPlaceGeoJSON[] = data.hits.hits.map(
    (hit: TESHit) => hit._source
  );
  return places;
};
