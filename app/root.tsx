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
import Sidebar from "./components/layout/Sidebar";
import { useLocation } from "react-router-dom";
import Loading from "./components/layout/Loading";
import type { LinksFunction } from "@remix-run/node";
import RouteError from "./components/errorResponses/RouteError";
import CodeError from "./components/errorResponses/CodeError";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHomepage = location.pathname === "/";

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
        {isHomepage && <Sidebar />}
        <main
          className={`${isHomepage ? "ml-96" : "mx-auto"} relative mt-20 bg-white overflow-hidden`}
          id="main"
        >
          {children}
        </main>
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
