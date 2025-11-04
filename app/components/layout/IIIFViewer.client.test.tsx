// IIIFViewer.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import IIIFViewer from "./IIIFViewer.client";

// Mock CloverImage so we can inspect props
vi.mock("@samvera/clover-iiif/image", () => {
  return {
    default: ({ src, openSeadragonConfig, label }: any) => (
      <div data-testid="clover-image" data-src={src} data-label={label}>
        Mock CloverImage
        <pre>{JSON.stringify(openSeadragonConfig)}</pre>
      </div>
    ),
  };
});

describe("IIIFViewer component", () => {
  const mockPhoto = {
    full_url: "https://example.com/iiif/image",
    title: "Test Photo",
  };

  it("renders a container with correct styles", () => {
    const { container } = render(<IIIFViewer photo={mockPhoto} />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveClass(
      "h-[50vh]",
      "w-full",
      "border",
      "border-black/50",
      "rounded-md",
      "shadow-lg"
    );
  });

  it("renders CloverImage with correct props", () => {
    render(<IIIFViewer photo={mockPhoto} />);
    const clover = screen.getByTestId("clover-image");

    expect(clover).toHaveAttribute("data-src", mockPhoto.full_url);
    expect(clover).toHaveAttribute("data-label", mockPhoto.title);
  });

  it("uses photo.name when title is missing", () => {
    const photoWithNameOnly = {
      full_url: "https://example.com/iiif/alt",
      name: "Alt Name",
    };

    render(<IIIFViewer photo={photoWithNameOnly} />);
    const clover = screen.getByTestId("clover-image");

    expect(clover).toHaveAttribute("data-label", "Alt Name");
  });

  it("passes the openSeadragonConfig to CloverImage", () => {
    render(<IIIFViewer photo={mockPhoto} />);
    const clover = screen.getByTestId("clover-image");

    // Verify config snapshot
    expect(clover.textContent).toMatch(/"minZoomImageRatio":0.3/);
    expect(clover).toMatchSnapshot();
  });
});
