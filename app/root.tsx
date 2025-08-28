import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from "react-router";
import styles from "./index.css?url";
import Navbar from "./components/layout/Navbar";
import Loading from "./components/layout/Loading";
import RouteError from "./components/errorResponses/RouteError";
import CodeError from "./components/errorResponses/CodeError";
// https://stackoverflow.com/a/59429852/1792144
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */
import { placeMetaTags } from "~/utils/placeMetaTags";
import { MapContext } from "./contexts";
import { useState } from "react";
import type { LinksFunction, MetaFunction } from "react-router";
import type { Map as TMap } from "maplibre-gl";
import Analytics from "./components/Analytics";

export const meta: MetaFunction = () => {
  return placeMetaTags();
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "icon", href: "/images/gca_favicon.jpg" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<TMap>();
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/*
          It's important that Links comes before Meta
          https://github.com/remix-run/remix/issues/9242#issuecomment-2466234861
        */}
        <Links />
        <Meta />
      </head>
      <body className="font-inter bg-white">
        <a href="#main" className="sr-only">
          skip to main content
        </a>
        <Navbar />
        <main
          className={`mx-auto relative mt-20 bg-white overflow-hidden`}
          id="main"
        >
          <MapContext.Provider value={{ map, setMap, mapLoaded, setMapLoaded }}>
            {children}
          </MapContext.Provider>
        </main>
        <Loading />
        <ScrollRestoration />
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <RouteError error={error} />;
  } else if (error instanceof Error) {
    return <CodeError error={error} />;
  } else {
    return <h1>Unknown Error</h1>;
  }
}
