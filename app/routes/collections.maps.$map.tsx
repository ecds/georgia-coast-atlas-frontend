import { useLoaderData, useLocation, useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { mapIndexCollection } from "~/config";
import { fetchBySlug } from "~/data/coredata";
import { MapContext } from "~/contexts";
import Map from "~/components/mapping/Map.client";
import ClientOnly from "~/components/ClientOnly";
import { wmsLayer } from "~/mapStyles";
import { LngLatBounds } from "maplibre-gl";
import StyleSwitcher from "~/components/mapping/StyleSwitcher";
import LayerOpacity from "~/components/mapping/LayerOpacity";
import Compass from "~/components/mapping/Compass";
import { collectionMetadata } from "~/utils/collectionMetaTags";
import type { LoaderFunctionArgs } from "react-router";
import type { ESMapItem, ESCollectionItem } from "~/esTypes";

export const meta = ({ data }: { data: { mapLayer: ESCollectionItem } }) => {
  const { mapLayer } = data;

  const previewImage = mapLayer.thumbnail_url.replace("!250,250", "!1200,630");

  return collectionMetadata({
    title: mapLayer.title ?? mapLayer.name,
    description: mapLayer.description ?? "A map from the Georgia Coast Atlas.",
    image: previewImage,
    slug: `mapLayer/${mapLayer.slug}`,
  });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const mapLayer: ESMapItem = await fetchBySlug(params.map, mapIndexCollection);

  if (!mapLayer) {
    throw new Response(null, { status: 404, statusText: "Map not found" });
  }

  return { mapLayer };
};

const MapDetail = () => {
  const { mapLayer } = useLoaderData<typeof loader>();
  const { map } = useContext(MapContext);
  const [opacity, setOpacity] = useState<number>(100);
  const location = useLocation();
  const navigate = useNavigate();
  const [backTo, setBackTo] = useState("Back to Map Collection");
  const [bounds, setBounds] = useState<LngLatBounds | undefined>(undefined);

  useEffect(() => {
    if (!location.state?.backTo) return;
    setBackTo(location.state.backTo);
  }, [location]);

  useEffect(() => {
    setBounds(new LngLatBounds(mapLayer.bbox));
  }, [mapLayer]);

  useEffect(() => {
    if (!map) return;
    for (const [index, resource] of mapLayer.wms_resources.entries()) {
      const id = `${mapLayer.uuid}-${index}`;
      const { source, layer } = wmsLayer({
        url: resource,
        id,
        initialOpacity: 1,
      });

      map.addSource(id, source);
      map.addLayer(layer);
      map.once("styledata", () => map.moveLayer(layer.id));
    }

    const bounds = new LngLatBounds(mapLayer.bbox);

    map.fitBounds(bounds, { padding: 50, bearing: mapLayer.bearing ?? 0 });

    return () => {
      for (const index in mapLayer.wms_resources) {
        const id = `${mapLayer.uuid}-${index}`;
        map.removeLayer(id);
        map.removeSource(id);
      }
    };
  }, [map, mapLayer]);

  useEffect(() => {
    for (const index in mapLayer.wms_resources) {
      const id = `${mapLayer.uuid}-${index}`;
      map?.setPaintProperty(id, "raster-opacity", opacity * 0.01);
    }
  }, [map, mapLayer, opacity]);

  const handleOpacityChange = (newValue: string) => {
    setOpacity(parseInt(newValue));
  };

  return (
    <div className="flex flex-row overflow-hidden">
      <div className="w-1/3 p-6">
        <button
          className="text-sm text-activeCounty underline hover:font-semibold self-start capitalize"
          onClick={() => navigate(-1)}
        >
          {backTo}
        </button>
        <h1 className="text-xl mt-2">{mapLayer.name}</h1>
        <LayerOpacity
          id={mapLayer.uuid}
          opacity={opacity}
          handleChange={handleOpacityChange}
          disabled={false}
        />
        <hr className="my-2" />
        {mapLayer.publisher && (
          <cite className="text-sm">
            <span className="font-bold">Published by:</span>{" "}
            {mapLayer.publisher}
          </cite>
        )}
        <p>{mapLayer.description ?? ""}</p>
      </div>
      <div className="flex-grow">
        <ClientOnly>
          <Map bearing={mapLayer.bearing} bounds={bounds}>
            <StyleSwitcher />
            {mapLayer.bearing && <Compass />}
          </Map>
        </ClientOnly>
      </div>
    </div>
  );
};

export default MapDetail;
