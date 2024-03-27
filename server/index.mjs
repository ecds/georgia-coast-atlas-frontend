var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
));

// empty-module:~/components/MapPane.client
var require_MapPane = __commonJS({
  "empty-module:~/components/MapPane.client"(exports, module) {
    module.exports = {};
  }
});

// server.ts
import { createRequestHandler } from "@remix-run/architect";

// server-entry-module:@remix-run/dev/server-build
var server_build_exports = {};
__export(server_build_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  future: () => future,
  mode: () => mode,
  publicPath: () => publicPath,
  routes: () => routes
});

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx } from "react/jsx-runtime";
var ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  Layout: () => Layout,
  default: () => App,
  links: () => links
});
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";

// app/data/islands.ts
var Islands = [
  { slug: "ossabaw", label: "Ossabaw" },
  { slug: "sapelo", label: "Sapelo" },
  { slug: "st-catherines", label: "St. Catherine's" },
  { slug: "wassaw", label: "Wassaw" },
  { slug: "wolf", label: "Wolf" }
], islands_default = Islands;

// app/tailwind.css
var tailwind_default = "/_static/build/_assets/tailwind-2DUX7BUO.css";

// app/root.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var links = () => [{ rel: "stylesheet", href: tailwind_default }];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx2("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx2("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx2(Meta, {}),
      /* @__PURE__ */ jsx2(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "bg-slate-600", children: [
      /* @__PURE__ */ jsx2("a", { href: "#main", className: "sr-only", children: "skip to main content" }),
      /* @__PURE__ */ jsx2("nav", { className: "bg-gray-800 fixed top-0 w-screen z-50 p-6 h-20", children: /* @__PURE__ */ jsxs("ul", { className: "flex flex-row space-x-6 uppercase", children: [
        /* @__PURE__ */ jsx2("li", { className: "text-gray-300", children: /* @__PURE__ */ jsx2(Link, { to: "/", children: "home" }) }),
        islands_default.map((island) => /* @__PURE__ */ jsx2("li", { className: "text-gray-300", children: /* @__PURE__ */ jsxs(Link, { to: `${island.slug}-island`, children: [
          island.label,
          " Island"
        ] }) }, island.slug))
      ] }) }),
      /* @__PURE__ */ jsx2("main", { className: "mx-auto relative mt-20 bg-white", id: "main", children }),
      /* @__PURE__ */ jsx2(ScrollRestoration, {}),
      /* @__PURE__ */ jsx2(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx2(Outlet, {});
}

// app/routes/$island.tsx
var island_exports = {};
__export(island_exports, {
  default: () => island_default,
  loader: () => loader
});
import { useLoaderData, useLocation } from "@remix-run/react";

// node_modules/remix-utils/build/react/client-only.js
import * as React from "react";

// node_modules/remix-utils/build/react/use-hydrated.js
import { useSyncExternalStore } from "react";
function subscribe() {
  return () => {
  };
}
function useHydrated() {
  return useSyncExternalStore(subscribe, () => !0, () => !1);
}

// node_modules/remix-utils/build/react/client-only.js
function ClientOnly({ children, fallback = null }) {
  return useHydrated() ? React.createElement(React.Fragment, null, children()) : React.createElement(React.Fragment, null, fallback);
}

// app/routes/$island.tsx
var import_MapPane = __toESM(require_MapPane(), 1);
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var loader = async ({ params }) => (await (await fetch(
  `https://wp.georgiacoastatlas.org/wp-json/wp/v2/pages/?slug=${params.island}`
)).json())[0] || null, IslandPage = () => {
  let location = useLocation(), wpContent = useLoaderData(location);
  return /* @__PURE__ */ jsxs2("div", { className: "flex flex-row overflow-hidden h-[calc(100vh-5rem)]", children: [
    /* @__PURE__ */ jsxs2("div", { className: "basis-1/2 overflow-scroll", children: [
      /* @__PURE__ */ jsx3("h1", { className: "text-2xl my-2 p-4 sticky top-0 bg-white z-10", children: wpContent.title.rendered }),
      /* @__PURE__ */ jsx3(
        "div",
        {
          className: "relative p-4",
          dangerouslySetInnerHTML: {
            __html: wpContent.content.rendered
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsx3("div", { className: "basis-1/2", children: /* @__PURE__ */ jsx3(ClientOnly, { children: () => /* @__PURE__ */ jsx3(import_MapPane.default, {}) }) })
  ] });
}, island_default = IslandPage;

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Index,
  loader: () => loader2,
  meta: () => meta
});
import { useLoaderData as useLoaderData2 } from "@remix-run/react";
import { jsx as jsx4 } from "react/jsx-runtime";
var loader2 = async () => (await (await fetch(
  "https://wp.georgiacoastatlas.org/wp-json/wp/v2/pages/?slug=homepage"
)).json())[0] || null, meta = () => [
  { title: "New Remix App" },
  { name: "description", content: "Welcome to Remix!" }
];
function Index() {
  let wpContent = useLoaderData2();
  return /* @__PURE__ */ jsx4(
    "div",
    {
      dangerouslySetInnerHTML: {
        __html: wpContent.content.rendered
      }
    }
  );
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/_static/build/entry.client-LDVIUA7C.js", imports: ["/_static/build/_shared/chunk-HTIHDIN4.js", "/_static/build/_shared/chunk-NPMEYKEH.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/_static/build/root-NHUHZHJN.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/$island": { id: "routes/$island", parentId: "root", path: ":island", index: void 0, caseSensitive: void 0, module: "/_static/build/routes/$island-XZ73IXKJ.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/_static/build/routes/_index-BPUCRK24.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "a794f3d9", hmr: void 0, url: "/_static/build/manifest-A794F3D9.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "production", assetsBuildDirectory = "public/build", future = { v3_fetcherPersist: !1, v3_relativeSplatPath: !1, v3_throwAbortReason: !1 }, publicPath = "/_static/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/$island": {
    id: "routes/$island",
    parentId: "root",
    path: ":island",
    index: void 0,
    caseSensitive: void 0,
    module: island_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  }
};

// server.ts
import { installGlobals } from "@remix-run/node";
import sourceMapSupport from "source-map-support";
sourceMapSupport.install();
installGlobals();
var handler = createRequestHandler({
  build: server_build_exports,
  mode
});
export {
  handler
};
