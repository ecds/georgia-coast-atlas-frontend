import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import styles from "./index.css?url";
import type { LinksFunction } from "@remix-run/node";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import { useLocation } from "react-router-dom";
import Loading from "./components/layout/Loading";

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
      <body className="bg-slate-600">
        <a href="#main" className="sr-only">
          skip to main content
        </a>
        <Navbar />
        <Sidebar />
        <main
          className={`${isHomepage ? "ml-96" : "mx-auto"} relative mt-20 bg-white`}
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
  console.error(error);
  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        dang
        <Scripts />
      </body>
    </html>
  );
}
