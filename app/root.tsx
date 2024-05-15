import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteError, } from "@remix-run/react";
import styles from "./tailwind.css";
import type { LinksFunction } from "@remix-run/node";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import { useLocation } from "react-router-dom";

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
        {!isHomepage && (
          <main className="mx-auto relative mt-20 bg-white" id="main">
            {children}
          </main>
        )}
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