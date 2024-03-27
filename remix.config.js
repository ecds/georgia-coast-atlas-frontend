/** @type {import('@remix-run/dev').AppConfig} */
export default {
  tailwind: true,
  postcss: true,
  server: "server.ts",
  serverModuleFormat: "esm",
  publicPath: "/_static/build/",
  serverBuildPath: "server/index.mjs",
  // assetsBuildDirectory: "public/build",
  serverDependenciesToBundle: [/^remix-utils.*/],
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: ".netlify/functions-internal/server.js",
  // publicPath: "/build/",
};
