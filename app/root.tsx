import { useState } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import styles from "./index.css?url";
import Navbar from "./components/layout/Navbar";
import { useLocation } from "react-router-dom";
import Loading from "./components/layout/Loading";
import RouteError from "./components/errorResponses/RouteError";
import CodeError from "./components/errorResponses/CodeError";
import { MapContext } from "./contexts";
import type { LinksFunction } from "@remix-run/node";
import type { Map } from "maplibre-gl";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHomepage = location.pathname === "/";
  const [map, setMap] = useState<Map>();
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-inter bg-white">
        <a href="#main" className="sr-only">
          skip to main content
        </a>
        <Navbar />
        <MapContext.Provider value={{ map, setMap, mapLoaded, setMapLoaded }}>
          <main
            className={`mx-auto relative mt-20 bg-white overflow-hidden`}
            id="main"
          >
            {children}
          </main>
        </MapContext.Provider>
        <Loading />
        <ScrollRestoration />
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
