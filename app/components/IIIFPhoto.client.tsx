import CloverImage from "@samvera/clover-iiif/image";
import type { TIIIFBody } from "~/types";

const openSeadragonConfig = {
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
  return (
    <CloverImage
      body={activePhotograph}
      openSeadragonConfig={openSeadragonConfig}
    />
  );
};

export default IIIFPhoto;
