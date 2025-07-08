import chroma from "chroma-js";
import type { Map } from "maplibre-gl";

interface Props {
  map: Map;
  color?: string;
}
// implementation of StyleImageInterface to draw a pulsing dot icon on the map
// Search for StyleImageInterface in https://maplibre.org/maplibre-gl-js/docs/API/
export const pulsingDot = ({ map, color = "#FF6464" }: Props) => {
  // if (!document) return;

  const rgb = chroma(color).rgb();
  const size = 75;
  const canvas = document.createElement("canvas");
  const icon = {
    width: size,
    height: size,
    data: canvas.getContext("2d")?.getImageData(0, 0, size, size).data,
    canvas,
    context: canvas.getContext("2d"),

    // get rendering context for the map canvas when layer is added to the map
    onAdd() {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    },

    // called once before every frame where the icon will be used
    render() {
      if (!this.context) return;
      const duration = 1000;
      const t = (performance.now() % duration) / duration;

      const radius = (size / 2) * 0.3;
      const outerRadius = (size / 2) * 0.7 * t + radius;

      // draw outer circle
      this.context.clearRect(0, 0, this.width, this.height);
      this.context.beginPath();
      this.context.arc(
        this.width / 2,
        this.height / 2,
        outerRadius,
        0,
        Math.PI * 2
      );
      this.context.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]},${1 - t})`;
      this.context.fill();

      // draw inner circle
      this.context.beginPath();
      this.context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
      this.context.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;
      // this.context.strokeStyle = "white";
      // this.context.lineWidth = 2 + 4 * (1 - t);
      this.context.fill();
      this.context.stroke();

      // update this image's data with data from the canvas
      this.data = this.context.getImageData(0, 0, this.width, this.height).data;

      // continuously repaint the map, resulting in the smooth animation of the dot
      map.triggerRepaint();

      // return `true` to let the map know that the image was updated
      return true;
    },
  };

  return icon as maplibregl.StyleImageInterface;
};
