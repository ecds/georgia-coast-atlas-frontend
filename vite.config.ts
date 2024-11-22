import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import SiteMap from "vite-plugin-sitemap";
import { islands } from "./app/config";

const ISLANDS = islands.map((island) => `/${island.slug}-island`);

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
      },
    }),
    tsconfigPaths(),
    SiteMap({
      hostname: "https://georgiacoastatlas.org",
      outDir: "public",
      dynamicRoutes: [...ISLANDS],
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
