// FIXME: This is a known issue: https://github.com/typesense/typesense-instantsearch-adapter/issues/199
import TypesenseInstantSearchAdapterExport from "typesense-instantsearch-adapter";

export const TypesenseInstantSearchAdapter =
  // @ts-ignore
  TypesenseInstantSearchAdapterExport.default ??
  TypesenseInstantSearchAdapterExport;
