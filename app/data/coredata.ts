import {
  countyIndexCollection,
  dataHosts,
  indexCollection,
  keys,
} from "~/config";
import type { TESHit, TSearchOptions } from "~/types";

const elasticSearchHeaders = () => {
  const esHeaders = new Headers();
  esHeaders.append("authorization", `ApiKey ${keys.elasticsearch}`);
  esHeaders.append("Content-Type", "application/json");
  return esHeaders;
};

export const elasticSearchPost = async ({
  body,
  collection,
}: {
  body: unknown;
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

export const fetchBySlug = async (
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
        "other_places",
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
              types: type,
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
        "featured_photograph",
        "identifier",
        "location",
        "short_description",
        "slug",
        "types",
        "uuid",
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
  query = {},
}: TSearchOptions) => {
  const body = {
    query,
    size: 250,
    from: 0,
    _source: {
      includes: ["geojson"],
    },
  };

  return await elasticSearchPost({ body, collection });
};

export const fetchPlaceGeoJSON = async ({
  query,
  fields = ["uuid"],
  collection = indexCollection,
}: TSearchOptions) => {
  const body = {
    query: {
      simple_query_string: { query, fields },
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

export const fetchDataBySlugFromTopics = async (slug: string) => {
  if (!slug) {
    throw new Error("Slug is required.");
  }

  const body = {
    query: {
      simple_query_string: { query: slug, fields: ["slug"] },
    },
    size: 1,
    from: 0,
  };

  const collection = "georgia_coast_topics";

  try {
    const response = await elasticSearchPost({ body, collection });

    if (response && response.length > 0) {
      return response[0]; // Return the first result
    }

    throw new Error(`No data found for slug: ${slug}`);
  } catch (error) {
    console.error(`Error fetching data for slug: ${slug}`, error);
    throw new Error("Failed to fetch data.");
  }
};

export const fetchTopicBySlug = async (
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
  };

  const hits = await elasticSearchPost({ body, collection });
  return hits[0];
};
