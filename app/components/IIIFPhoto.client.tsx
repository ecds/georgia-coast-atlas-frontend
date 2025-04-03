import { useContext } from "react";
import CloverImage from "@samvera/clover-iiif/image";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { RelatedMediaContext } from "~/contexts";
import type { Options } from "openseadragon";

const openSeadragonConfig: Options = {
  showNavigator: false,
  showRotationControl: false,
  gestureSettingsMouse: {
    scrollToZoom: true,
  },
  navigatorPosition: "TOP_LEFT",
};

const IIIFPhoto = () => {
  const { activePhotograph } = useContext(RelatedMediaContext);
  // const overlayRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <CloverImage
        body={activePhotograph}
        openSeadragonConfig={openSeadragonConfig}
      />
      {/* <div ref={osdContainerRef} id="viewer" className="h-96 w-96"></div> */}
      {/* <div ref={overlayRef} className="bg-island">
        hello <FontAwesomeIcon icon={faVolumeHigh} />
      </div> */}
    </>
  );
};

export default IIIFPhoto;
