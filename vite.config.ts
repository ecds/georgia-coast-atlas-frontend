import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import SiteMap from "vite-plugin-sitemap";
import { islands } from "./app/config";

const ISLANDS = islands.map((island) => `/${island.slug}-island`);

const robotOption = {
  userAgent: "*",
  [process.env.NODE_ENV === "production" ? "allow" : "disallow"]: "/",
};

installGlobals();

export default defineConfig({
  plugins: [
    remix(),
    tsconfigPaths(),
    SiteMap({
      hostname: "https://georgiacoastatlas.org",
      outDir: "public",
      dynamicRoutes: [...ISLANDS],
      robots: [robotOption],
    }),
  ],
  ssr: {
    noExternal: [
      "remix-utils",
      "maplibre-gl",
      "@turf/turf",
      "@samvera/clover-iiif",
    ],
  },
});
