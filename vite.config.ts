import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import SiteMap from "vite-plugin-sitemap";
import { islands } from "./app/config";

const ISLANDS = islands.map((island) => `/${island.id}-island`);

const robotOption = { userAgent: "*", [process.env.ROBOTS ?? "allow"]: "/" };

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    SiteMap({
      hostname: "https://georgiacoastatlas.org",
      outDir: "public",
      dynamicRoutes: [...ISLANDS],
      robots: [robotOption],
    }),
  ],
  optimizeDeps: { exclude: ["virtual:react-router/server-build"] },
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
