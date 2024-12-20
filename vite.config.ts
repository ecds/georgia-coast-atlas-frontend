import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import SiteMap from "vite-plugin-sitemap";
import { ISLAND_ROUTES } from "./app/config";

const robotOption = {
  userAgent: "*",
  [process.env.ROBOTS ?? "allow"]: "/",
};

installGlobals();

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_singleFetch: true,
        v3_fetcherPersist: true,
        v3_lazyRouteDiscovery: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_routeConfig: true,
      },
    }),
    tsconfigPaths(),
    SiteMap({
      hostname: "https://georgiacoastatlas.org",
      outDir: "public",
      dynamicRoutes: [...ISLAND_ROUTES],
      robots: [robotOption],
    }),
  ],
  ssr: {
    target: "node",
    noExternal: [
      "remix-utils",
      "maplibre-gl",
      "@turf_turf",
      "@samvera_clover-iiif",
    ],
  },
});
