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
  "/topics/cultural-landscape": {};
  "/collections/panos": {};
  "/collections/maps": {};
  "/collections/panos/:pano": {
    "pano": string;
  };
  "/collections/maps/:map": {
    "map": string;
  };
  "/topics/climate-change": {};
  "/topics/historic-sites": {};
  "/iiif/:type/:year/:id": {
    "type": string;
    "year": string;
    "id": string;
  };
  "/about/bibliography": {};
  "/collections": {};
  "/topics/plantations": {};
  "/about/contact": {};
  "/about/project": {};
  "/topics": {};
  "/about": {};
  "/places": {};
  "/places/explore": {};
  "/places/search": {};
  "/places/:id": {
    "id": string;
  };
};