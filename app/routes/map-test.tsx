import { useEffect, useRef } from "react";
import { Map, useMap } from "react-map-gl/maplibre";
import { ClientOnly } from "remix-utils/client-only";
// import { LngLatBounds, LngLat } from "maplibre-gl";
import style from "~/data/style.json";
import { WarpedMapLayer } from "@allmaps/maplibre";

// const bounds = new LngLatBounds(
//   new LngLat(-82.01409567385569, 30.679059125170696),
//   new LngLat(-80.92207334522604, 32.11595891326837),
// );

const WarpedLayer = () => {
  const { current: map } = useMap();
  const layerRef = useRef<WarpedMapLayer>();
  useEffect(() => {
    console.log("🚀 ~ useEffect ~ map.loaded():", map?.loaded());
    const addLayer = () => {
      layerRef.current = new WarpedMapLayer("blah");
      if (map && map.loaded()) {
        map.getMap().addLayer(layerRef.current);
        layerRef.current.addGeoreferenceAnnotationByUrl(
          "https://dev.georgiacoastatlas.org/iiif/annotation-page/1954/Shellman_Bluff",
        );
        console.log(
          "🚀 ~ useEffect ~ warpedMapLayer: ADDING",
          layerRef.current,
        );
      }
    };

    map?.getMap().on("load", addLayer);

    console.log(
      "🚀 ~ useEffect ~ !map?.getMap().getLayer:",
      !map?.getMap().getLayer("blah"),
    );
    if (map?.loaded() && map?.getMap().getLayer("blah")) addLayer();

    return () => {
      console.log("return???");
      // warpedMapLayer.clear();
      // if (map?.getMap().getLayer("blah"))
      //   map?.getMap().removeLayer(warpedMapLayer.id);
    };
  }, [map]);

  return <></>;
};

const MapTest = () => {
  return (
    <div>
      <ClientOnly fallback={<div></div>}>
        {() => (
          <Map
            initialViewState={{
              longitude: -81.40348956381558,
              latitude: 31.41113196761974,
              zoom: 9,
            }}
            mapStyle={style}
            maxPitch={0}
            preserveDrawingBuffer
            style={{ height: "100vh", width: "100vw" }}
          >
            <WarpedLayer />
          </Map>
        )}
      </ClientOnly>
    </div>
  );
};

export default MapTest;
