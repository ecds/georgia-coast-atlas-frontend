import {
  annotationPainting,
  annotationGeo,
  annotationPage,
  canvas,
  manifest,
} from "~/utils/iiif";
import topoCoords from "~/data/topoCoords.json";
import type { LoaderFunctionArgs } from "react-router";
import type {
  TTopoCoords,
  TTopoCoordsRecord,
  TTopoName,
  TTopoYear,
} from "~/types";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { id, year } = params;
  if (!id || !year) return {};
  const data: TTopoCoords = (topoCoords as TTopoCoordsRecord)[id as TTopoName][
    year as TTopoYear
  ];
  const imageService = await fetch(
    `https://iiif.ecds.io/iiif/3/topos/${year}/${id}.tiff/info.json`
  );
  const imageData = await imageService.json();
  const { url } = request;
  const { protocol, host } = new URL(request.url);
  const options = { imageData, id, year, protocol, host, url, data };
  let responseData = {};
  switch (params.type) {
    case "manifest":
      responseData = manifest(options);
      break;
    case "annotation-page":
      responseData = annotationPage(options);
      break;
    case "annotation-painting":
      responseData = annotationPainting(options);
      break;
    case "annotation-geo":
      responseData = annotationGeo(options);
      break;
    case "canvas":
      responseData = canvas(options);
      break;
    default:
      break;
  }

  return responseData;
};
