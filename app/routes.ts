import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("places", "./routes/places/root.tsx", [
    index("./routes/places/places.tsx"),
    route(":slug", "./routes/places/place.tsx"),
  ]),
  route("about", "./routes/about/root.tsx", [
    index("./routes/about/index.tsx"),
    route("bibliography", "./routes/about/bibliography.tsx"),
    route("contact", "./routes/about/contact.tsx"),
    route("project", "./routes/about/project.tsx"),
    route("team", "./routes/about/team.tsx"),
  ]),
  route("collections", "./routes/collections/root.tsx", [
    index("./routes/collections/index.tsx"),
    route("maps", "./routes/collections/maps.tsx"),
    route("maps/:map", "./routes/collections/map.tsx"),
    route("panos", "./routes/collections/panos.tsx"),
    route("panos/:pano", "./routes/collections/pano.tsx"),
    route("photographs", "./routes/collections/photographs.tsx"),
    route("photographs/:photograph", "./routes/collections/photograph.tsx"),
    route("videos", "./routes/collections/videos.tsx"),
    route("videos/:video", "./routes/collections/video.tsx"),
  ]),
  route("iiif/:type/:year/:id", "./routes/iiif.tsx"),
] satisfies RouteConfig;
