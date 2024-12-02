import {
  coreDataRelatedEndpoints,
  countyIndexCollection,
  dataHosts,
  indexCollection,
  keys,
  modelFieldUUIDs,
} from "~/config";
import type { TPlaceRecord, TESHit, TSearchOptions } from "~/types";

const elasticSearchHeaders = () => {
  const esHeaders = new Headers();
  esHeaders.append("authorization", `ApiKey ${keys.elasticsearch}`);
  esHeaders.append("Content-Type", "application/json");
  return esHeaders;
};

const elasticSearchPost = async ({
  body,
  collection,
}: {
  body: {};
  collection: string;
}) => {
  const response = await fetch(
    `${dataHosts.elasticSearch}/${collection}/_search`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: elasticSearchHeaders(),
    }
  );

  const data = await response.json();
  const results = data.hits.hits.map((hit: TESHit) => hit._source);
  return results;
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

export const fetchPlaceBySlug = async (
  slug: string | undefined,
  collection: string
) => {
  if (!slug) return undefined;
  const body = {
    query: {
      simple_query_string: { query: slug, fields: ["slug"] },
    },
    size: 1,
    from: 0,
    _source: {
      includes: [
        "bbox",
        "county",
        "description",
        "featured_photograph",
        "featured_video",
        "identifier",
        "manifests",
        "map_layers",
        "name",
        "location",
        "photographs",
        "places",
        "related_videos",
        "slug",
        "short_description",
        "topos",
        "types",
        "uuid",
        "videos",
      ],
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
  const place = data.hits.hits.map((hit: TESHit) => hit._source)[0];
  return place;
};

export const fetchCounties = async () => {
  const body = {
    _source: {
      includes: ["name", "location", "uuid", "slug"],
    },
  };
  const response = await fetch(
    `${dataHosts.elasticSearch}/${countyIndexCollection}/_search`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: elasticSearchHeaders(),
    }
  );

  const data = await response.json();
  const counties = data.hits.hits.map((hit: TESHit) => hit._source);
  return counties;
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
  const places = data.hits.hits.map((hit: TESHit) => hit._source);
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

  return await elasticSearchPost({ body, collection });
};

export const fetchPlaceGeoJSON = async ({
  uuid,
  collection = indexCollection,
}: TSearchOptions) => {
  const body = {
    query: {
      simple_query_string: { query: uuid, fields: ["uuid"] },
    },
    size: 1,
    from: 0,
    _source: {
      includes: ["geojson"],
    },
  };

  const response = await elasticSearchPost({ body, collection });

  return response[0].geojson;
};
