import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("./routes/_index.tsx"),
  route("places", "./routes/places/root.tsx", [
    index("./routes/places/index.tsx"),
    route(":slug", "./routes/places/place.tsx"),
  ]),
  route("iiif/:type/:year/:id", "./routes/iiif.tsx"),
] satisfies RouteConfig;
