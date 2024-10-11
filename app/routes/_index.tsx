import { Suspense } from "react";
import { useLoaderData, defer, Link } from "@remix-run/react";
import { fetchPlacesByType } from "~/data/coredata";
import type { TPlace } from "~/types";
import type { LoaderFunction } from "@remix-run/node";
import "maplibre-gl/dist/maplibre-gl.css";
import Loading from "~/components/layout/Loading";

export const loader: LoaderFunction = async () => {
  const islands: TPlace[] = await fetchPlacesByType("Barrier Island");
  return defer({ islands });
};

export const HydrateFallback = () => {
  return <Loading />;
};

export default function Index() {
  const { islands } = useLoaderData<typeof loader>();

  return (
    <div className="w-full h-full">
      <Suspense fallback={<Loading />}>
        <ul className="space-y-2 divide-y divide-gray-200">
          {islands.map((island: TPlace) => (
            <li
              key={island.uuid}
              className="flex justify-between py-2 items-center"
            >
              <Link
                to={`/islands/${island.slug}`}
                className="font-bold text-black"
              >
                {island.name}
              </Link>
            </li>
          ))}
        </ul>
      </Suspense>
    </div>
  );
}
