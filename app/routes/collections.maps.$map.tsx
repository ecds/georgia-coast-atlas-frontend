import { Link, useLoaderData } from "react-router";
import { useContext, useEffect, useState } from "react";
import { mapIndexCollection } from "~/config";
import { fetchBySlug } from "~/data/coredata";
import { MapContext } from "~/contexts";
import Map from "~/components/mapping/Map.client";
import { wmsLayer } from "~/mapStyles";
import { LngLatBounds } from "maplibre-gl";
import StyleSwitcher from "~/components/mapping/StyleSwitcher";
import LayerOpacity from "~/components/mapping/LayerOpacity";
import type { LoaderFunctionArgs } from "react-router";
import type { ESMapItem } from "~/esTypes";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const mapLayer: ESMapItem = await fetchBySlug(params.map, mapIndexCollection);

  if (!mapLayer) {
    throw new Response(null, {
      status: 404,
      statusText: "Map not found",
    });
  }

  return { mapLayer };
};

const MapDetail = () => {
  const { mapLayer } = useLoaderData<typeof loader>();
  const { map } = useContext(MapContext);
  const [opacity, setOpacity] = useState<number>(100);

  useEffect(() => {
    if (!map) return;
    const { source, layer } = wmsLayer({
      placeLayer: mapLayer,
      initialOpacity: 1,
    });

    if (!map.getSource(mapLayer.uuid)) map.addSource(mapLayer.uuid, source);
    if (!map.getLayer(mapLayer.uuid)) map.addLayer(layer);

    const bounds = new LngLatBounds(mapLayer.bbox);

    map.fitBounds(bounds, { padding: 50 });

    return () => {
      if (map.getLayer(mapLayer.uuid)) map.removeLayer(mapLayer.uuid);
      if (map.getSource(mapLayer.uuid)) map.removeSource(mapLayer.uuid);
    };
  }, [map, mapLayer]);

  useEffect(() => {
    map?.setPaintProperty(mapLayer.uuid, "raster-opacity", opacity * 0.01);
  }, [map, mapLayer, opacity]);

  const handleOpacityChange = (newValue: string) => {
    setOpacity(parseInt(newValue));
  };

  return (
    <div className="flex flex-row overflow-hidden">
      <div className="w-1/3 p-6">
        <Link
          to="/collections/maps"
          className="text-sm text-activeCounty underline hover:font-semibold"
        >
          Back to Map Collection
        </Link>
        <h1 className="text-xl mt-2">{mapLayer.name}</h1>
        <LayerOpacity
          id={mapLayer.uuid}
          opacity={opacity}
          handleChange={handleOpacityChange}
          disabled={false}
        />
        <hr className="my-2" />
        <p>
          {mapLayer.description ??
            "Velit quis veniam commodo fugiat proident officia aute exercitation dolor duis amet non reprehenderit. Elit dolore ut Lorem dolore adipisicing nostrud cillum irure esse esse ipsum incididunt. In sunt laborum do aliqua magna veniam irure enim id officia. Est non qui commodo esse."}
        </p>
        {/* <ul>
          {mapLayer.places.map((place) => {
            return <li key={`map-layer-place-${place}`}>{place}</li>;
          })}
        </ul> */}
      </div>
      <div className="flex-grow">
        <Map>
          <StyleSwitcher />
        </Map>
      </div>
    </div>
  );
};

export default MapDetail;
