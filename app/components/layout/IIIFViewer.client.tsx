import CloverImage from "@samvera/clover-iiif/image";
import type { Options } from "openseadragon";
import type { ESPhotographItem } from "~/esTypes";

interface Props {
  photo: ESPhotographItem;
}

const openSeadragonConfig: Options = {
  showNavigator: false,
  showRotationControl: false,
  gestureSettingsMouse: {
    scrollToZoom: true,
  },
  navigatorPosition: "TOP_LEFT",
  homeFillsViewer: true,
  minZoomImageRatio: 0.3,
};

const IIIFViewer = ({ photo }: Props) => {
  return (
    <div className="h-[66vh] w-full border border-black/50 rounded-md shadow-lg">
      <CloverImage
        src={photo.full_url}
        openSeadragonConfig={openSeadragonConfig}
        label={photo.title ?? photo.name}
      />
    </div>
  );
};

export default IIIFViewer;
