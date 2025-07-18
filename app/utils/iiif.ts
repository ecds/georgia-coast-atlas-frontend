import type { TTopoCoords } from "~/types";

interface Props {
  imageData: {
    width: number;
    height: number;
    id: string;
    profile: string;
    type: string;
  };
  id: string | undefined;
  host: string;
  protocol: string;
  url: string;
  year: string;
  data: TTopoCoords;
}

const IIIF_SERVER = "https://iiif.ecds.io/iiif/3/topos";

export const manifest = ({
  imageData,
  id,
  host,
  protocol,
  url,
  year,
  data,
}: Props) => {
  return {
    "@context": "http://iiif.io/api/presentation/3/context.json",
    id: url,
    type: "Manifest",
    items: [
      thumbnail({ year, id }),
      canvas({
        imageData,
        id,
        host,
        protocol,
        url: `${protocol}//${host}/iiif/canvas/${year}/${id}`,
        year,
        data,
      }),
    ],
  };
};

export const thumbnail = ({ id, year }: { id?: string; year: string }) => {
  return {
    id: `${IIIF_SERVER}/${year}/${id}.tiff/square/200,/0/default.jpg`,
    type: "Image",
    format: "image/jpg",
    width: 200,
    height: 200,
  };
};

export const canvas = ({
  imageData,
  id,
  host,
  protocol,
  url,
  year,
  data,
}: Props) => {
  return {
    id: url,
    type: "Canvas",
    width: imageData.width,
    height: imageData.height,
    items: [
      annotationPage({
        imageData,
        id,
        host,
        protocol,
        url: `${protocol}//${host}/iiif/annotation-page/${year}/${id}`,
        year,
        data,
      }),
    ],
  };
};

export const annotationPage = ({
  imageData,
  id,
  host,
  protocol,
  url,
  data,
  year,
}: Props) => {
  return {
    type: "AnnotationPage",
    id: url,
    items: [
      annotationGeo({
        imageData,
        id,
        host,
        protocol,
        url: `${protocol}//${host}/iiif/annotation-geo/${year}/${id}`,
        year,
        data,
      }),
    ],
  };
};

export const annotationPainting = ({
  imageData,
  id,
  host,
  protocol,
  url,
  year,
}: Props) => {
  return {
    type: "Annotation",
    "@context": "http://iiif.io/api/presentation/3/context.json",
    id: url,
    motivation: "painting",
    target: `${protocol}//${host}/iiif/${year}/canvas/${id}`,
    body: {
      type: "Image",
      id: `${imageData.id}/full/max/0/default.jpg`,
      width: imageData.width,
      height: imageData.height,
      format: "image/jpg",
    },
  };
};

export const annotationGeo = ({
  imageData,
  id,
  host,
  protocol,
  url,
  year,
  data,
}: Props) => {
  const features = [];
  for (const group in data.resourceCoords) {
    features.push({
      type: "Feature",
      properties: {
        resourceCoords: data.resourceCoords[group],
      },
      geometry: {
        type: "Point",
        coordinates: data.geoCoords[group],
      },
    });
  }

  return {
    type: "Annotation",
    "@context": [
      "http://iiif.io/api/extension/georef/1/context.json",
      "http://iiif.io/api/presentation/3/context.json",
    ],
    id: url,
    motivation: "georeferencing",
    target: {
      type: "SpecificResource",
      source: {
        id: `${IIIF_SERVER}/${year}/${id}.tiff`,
        width: imageData.width,
        height: imageData.height,
        format: "image/jpg",
        type: imageData.type,
      },
      selector: {
        type: "SvgSelector",
        value: `<svg width="${imageData.width}" height="${imageData.height}"><polygon points="${data.resourceCoords
          .map((coord) => coord.toString())
          .join(" ")}" /></svg>`,
      },
    },
    body: {
      type: "FeatureCollection",
      transformation: {
        type: "polynomial",
        options: {
          order: 2,
        },
      },
      features,
      _allmaps: {
        id: url,
        version: url,
        image: {
          id: `${protocol}//${host}/iiif/${year}/annotation-page/${id}`,
          version: `${protocol}//${host}/iiif/${year}/annotation-page/${id}`,
          canvases: [],
        },
        scale: 0.411472,
        area: 165909713.54,
      },
    },
  };
};
