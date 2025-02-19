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
import { MapContext, SearchModalContext } from "./contexts";
import { ClientOnly } from "remix-utils/client-only";
import StyleSwitcher from "./components/mapping/StyleSwitcher";
import Map from "./components/mapping/Map.client";
import { PLACE_TYPES, topBarHeight } from "./config";
// https://stackoverflow.com/a/59429852/1792144
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */
import { pageMetadata } from "~/utils/pageMetadata";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import type { Map as TMap } from "maplibre-gl";

export const meta: MetaFunction = () => {
  return pageMetadata();
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "icon", href: "/images/gca_favicon.jpg" },
];

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
        <div className="hidden md:block grow">
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
  const [isMapRoute, setIsMapRoute] = useState<boolean>(true);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(true);
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
        <SearchModalContext.Provider
          value={{ searchModalOpen, setSearchModalOpen }}
        >
          <MapContext.Provider value={{ map, setMap, mapLoaded, setMapLoaded }}>
            <main
              className={`mx-auto relative mt-20 bg-white overflow-hidden`}
              id="main"
            >
              <ChildContent isMapRoute={isMapRoute}>{children}</ChildContent>
            </main>
          </MapContext.Provider>
          <div className="">
            {Object.keys(PLACE_TYPES).map((type) => {
              return (
                <span
                  key={type}
                  className={`bg-${PLACE_TYPES[type].bgColor} text-${PLACE_TYPES[type].textColor}`}
                ></span>
              );
            })}
          </div>
        </SearchModalContext.Provider>
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
