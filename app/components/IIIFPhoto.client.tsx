import CloverImage from "@samvera/clover-iiif/image";
import type { Options } from "openseadragon";
// import { useRef } from "react";
import type { TIIIFBody } from "~/types";

const openSeadragonConfig: Options = {
  showNavigator: false,
  showRotationControl: false,
  gestureSettingsMouse: {
    scrollToZoom: true,
  },
  navigatorPosition: "TOP_LEFT",
};

interface Props {
  activePhotograph: TIIIFBody | undefined;
}

const IIIFPhoto = ({ activePhotograph }: Props) => {
  // const overlayRef = useRef<HTMLDivElement>(null);
  // const openseadragonCallback = (viewer: Viewer) => {
  //   const pixelPoint = new Point(100, 100);
  //   const point = viewer.viewport.pointFromPixel(pixelPoint);
  // if (overlayRef.current) {
  //   viewer.addOverlay({
  //     element: overlayRef.current,
  //     location: point,
  //   });
  // }

  // Ways to test finding image coords.
  // viewer.addHandler("zoom", (e) => {
  //   new MouseTracker({
  //     element: viewer.element,
  //     clickHandler: (e) => {
  //       console.log(e);
  //     },
  //     enterHandler: (e) => {
  //       console.log(e);
  //     },
  //   });
  // });
  // };
  return (
    <>
      <CloverImage
        body={activePhotograph}
        openSeadragonConfig={openSeadragonConfig}
        // openSeadragonCallback={openseadragonCallback}
      />
      {/* <div ref={overlayRef} className="bg-island">
        hello <FontAwesomeIcon icon={faVolumeHigh} />
      </div> */}
    </>
  );
};

export default IIIFPhoto;
