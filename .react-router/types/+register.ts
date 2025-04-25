import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/collections/photographs/:photograph": {
    "photograph": string;
  };
  "/collections/photographs": {};
  "/collections/videos/:video": {
    "video": string;
  };
  "/collections/videos": {};
  "/collections/panos": {};
  "/collections/maps": {};
  "/collections/panos/:pano": {
    "pano": string;
  };
  "/collections/maps/:map": {
    "map": string;
  };
  "/iiif/:type/:year/:id": {
    "type": string;
    "year": string;
    "id": string;
  };
  "/about/bibliography": {};
  "/collections": {};
  "/topics/plantations": {};
  "/islands": {};
  "/about/project": {};
  "/topics": {};
  "/about": {};
  "/counties/:id": {
    "id": string;
  };
  "/islands/:id": {
    "id": string;
  };
  "/places/:id": {
    "id": string;
  };
  "/contact": {};
  "/explore": {};
  "/search": {};
  "/videos": {};
};