import { keys, dataHosts } from "~/config";
import type { SearchResult } from "~/types";

type Args =
  | {
      query?: string;
      facetBy?: string;
      page?: number;
      limit?: number;
    }
  | undefined;

export const search = async (args: Args) => {
  const { query, facetBy, page, limit } = args || {};
  const body = {
    searches: [
      {
        query_by: "name,names",
        limit: limit ?? 250,
        highlight_full_fields: "name,names",
        collection: "gca",
        q: query ?? "*",
        facet_by: facetBy ?? "*",
        max_facet_values: 20,
        page: page ?? 1,
      },
    ],
  };

  const response = await fetch(
    `https://${dataHosts.coreData}/multi_search?x-typesense-api-key=${keys.typesense}`,
    {
      headers: new Headers({
        accept: "application/json, text/plain, */*",
        "content-type": "text/plain",
      }),
      body: JSON.stringify(body),
      method: "POST",
    }
  );

  const data: SearchResult = await response.json();
  return data; //.results[0].hits.map((hit) => hit.document.name);
};
