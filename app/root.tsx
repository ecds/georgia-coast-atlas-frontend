import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import Islands from "./data/islands";
import styles from "./tailwind.css";
import type { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export function Layout({ children }: { children: React.ReactNode }) {
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
        <nav className="bg-gray-800 fixed top-0 w-screen z-50 p-6 h-20">
          <ul className="flex flex-row space-x-6 uppercase">
            <li className="text-gray-300">
              <Link to="/">home</Link>
            </li>
            {Islands.map((island) => {
              return (
                <li key={island.slug} className="text-gray-300">
                  <Link to={`${island.slug}-island`}>
                    {island.label} Island
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <main className="mx-auto relative mt-20 bg-white" id="main">
          {children}
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
