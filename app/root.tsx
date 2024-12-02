import { useEffect, useState } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
  useLocation,
} from "@remix-run/react";
import styles from "./index.css?url";
import Navbar from "./components/layout/Navbar";
import Loading from "./components/layout/Loading";
import RouteError from "./components/errorResponses/RouteError";
import CodeError from "./components/errorResponses/CodeError";
import { MapContext } from "./contexts";
import { ClientOnly } from "remix-utils/client-only";
import StyleSwitcher from "./components/mapping/StyleSwitcher";
import Map from "./components/mapping/Map.client";
import { pageMetadata } from "./utils/pageMetadata";
import { topBarHeight } from "./config";
// https://stackoverflow.com/a/59429852/1792144
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import type { Map as TMap } from "maplibre-gl";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "icon", href: "/images/gca_favicon.jpg" },
];

export const meta: MetaFunction = () => {
  return pageMetadata();
};

const ChildContent = ({
  children,
  isMapRoute,
}: {
  children: React.ReactNode;
  isMapRoute: boolean;
}) => {
  if (isMapRoute) {
    return (
      <div
        className={`flex flex-row overflow-hidden h-[calc(100vh-${topBarHeight})]`}
      >
        {children}
        <div className="hidden md:block flex-grow">
          <ClientOnly>
            {() => (
              <Map>
                <StyleSwitcher></StyleSwitcher>
              </Map>
            )}
          </ClientOnly>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export function Layout({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<TMap>();
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [isMapRoute, setIsMapRoute] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const mapRoutes = [
      "/search",
      "/places",
      "/island",
      "/explore",
      "/counties",
    ];
    setIsMapRoute(
      mapRoutes.some((route) => location.pathname.startsWith(route))
    );
  }, [location]);

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
            <ChildContent isMapRoute={isMapRoute}>{children}</ChildContent>
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
