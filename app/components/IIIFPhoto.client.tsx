import CloverImage from "@samvera/clover-iiif/image";
import type { TIIIFBody } from "~/types";

const viewerOptions = {
  canvasBackgroundColor: "#1a1d1e",
  showTitle: false,
  showIIIFBadge: false,
  informationPanel: {
    open: false,
    renderToggle: false,
    renderContentSearch: false,
  },
  openSeadragon: {
    showNavigator: false,
    showRotationControl: false,
    gestureSettingsMouse: {
      scrollToZoom: true,
    },
  },
};

interface Props {
  activePhotograph: TIIIFBody | undefined;
}

const IIIFPhoto = ({ activePhotograph }: Props) => {
  return (
    <CloverImage
      body={activePhotograph}
      openSeadragonConfig={viewerOptions.openSeadragon}
    />
  );
};

export default IIIFPhoto;
