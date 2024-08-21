import { json } from "@remix-run/node";
import {
  annotationPainting,
  annotationGeo,
  annotationPage,
  canvas,
  manifest,
} from "~/utils/iiif";
import topoCoords from "~/data/topoCoords.json";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type {
  TTopoCoords,
  TTopoCoordsRecord,
  TTopoNames,
  TTopoYears,
} from "~/types";

interface Props {}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { id, year } = params;
  if (!id || !year) return {};
  const data: TTopoCoords = (topoCoords as TTopoCoordsRecord)[id as TTopoNames][
    year as TTopoYears
  ];
  const imageService = await fetch(
    `https://iip.readux.io/iiif/3/topos/${year}/${id}.tiff/info.json`,
  );
  const imageData = await imageService.json();
  const { url } = request;
  const { protocol, host } = new URL(request.url);
  const options = { imageData, id, year, protocol, host, url, data };
  let response = {};
  switch (params.type) {
    case "manifest":
      response = manifest(options);
      break;
    case "annotation-page":
      response = annotationPage(options);
      break;
    case "annotation-painting":
      response = annotationPainting(options);
      break;
    case "annotation-geo":
      response = annotationGeo(options);
      break;
    case "canvas":
      response = canvas(options);
      break;
    default:
      break;
  }

  return json(response);
};
