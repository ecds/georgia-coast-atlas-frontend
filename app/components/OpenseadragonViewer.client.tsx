import { useContext, useEffect, useRef } from "react";
import OpenSeadragon from "openseadragon";
import { GalleryContext } from "~/contexts";

const OpenSeadragonViewer = () => {
  const { activePhotograph } = useContext(GalleryContext);
  const osdContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activePhotograph || !osdContainerRef.current) return;
    const viewer = OpenSeadragon({
      element: osdContainerRef.current,
      preserveViewport: true,
      placeholderFillStyle: "#cad5e2",
      sequenceMode: true,
      tileSources: [activePhotograph.service[0].id],
      showNavigationControl: false,
      showSequenceControl: false,
    });

    // When adding overlays, we can find the location given original image coordinates:
    // viewPortPoint = viewer.viewport.imageToViewportCoordinates(new Openseadragon.Point(x, y))

    return () => {
      viewer.destroy();
    };
  }, [activePhotograph]);

  return (
    <div className="flex">
      <div ref={osdContainerRef} id="viewer" className="h-96 w-full"></div>
    </div>
  );
};

export default OpenSeadragonViewer;
