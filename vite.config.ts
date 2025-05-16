import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import SiteMap from "vite-plugin-sitemap";
import { islands } from "./app/config";

const ISLANDS = islands.map((island) => `/${island.id}-island`);

const robotOption = { userAgent: "*", [process.env.ROBOTS ?? "allow"]: "/" };

export default defineConfig(({ isSsrBuild }) => ({
  server: { port: 3000 },
  build: {
    rollupOptions: isSsrBuild ? { input: "./server/app.js" } : undefined,
  },
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
    noExternal: [
      "remix-utils",
      "maplibre-gl",
      "@turf_turf",
      "@samvera_clover-iiif",
    ],
  },
}));
