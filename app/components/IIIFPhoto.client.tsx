// import CloverImage from "@samvera/clover-iiif/image";
import Viewer from "@samvera/clover-iiif/viewer";

const viewerOptions = {
  canvasBackgroundColor: "#1a1d1e",
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
  manifestURL: string;
}

const IIIFPhoto = ({ manifestURL }: Props) => {
  return (
    <div className="h-[480px] w-[480px]">
      <Viewer iiifContent={manifestURL} options={viewerOptions} />
      {/* <CloverImage src="https://iiif.dc.library.northwestern.edu/iiif/2/6ca016c5-de7f-4373-ae8f-7047fecf6ace/full/1000,/0/default.jpg" /> */}
    </div>
  );
};

export default IIIFPhoto;
