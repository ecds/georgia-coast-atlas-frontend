// Map.test.tsx
import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, expect, describe, it, vi } from "vitest";
// import { Map as MLMap } from "maplibre-gl";
import Map from "./Map.client";
import { MapContext } from "~/contexts";

// --- Mock maplibre-gl ---
const mockOnce = vi.fn((_event, cb) => cb());
const mockFitBounds = vi.fn();
const mockGetBounds = vi.fn(() => ({}));
const mockAddControl = vi.fn();
const mockRemove = vi.fn();

vi.mock("maplibre-gl", async () => {
  return {
    default: {
      MLMap: vi.fn().mockImplementation(() => ({
        once: mockOnce,
        fitBounds: mockFitBounds,
        getBounds: mockGetBounds,
        addControl: mockAddControl,
        remove: mockRemove,
      })),
    },
    AttributionControl: vi.fn(),
    LngLatBounds: vi.fn().mockImplementation(() => ({})),
  };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Map component", () => {
  // it("renders container divs", () => {
  //   render(
  //     <MapContext.Provider value={{ setMap: vi.fn(), setMapLoaded: vi.fn() }}>
  //       <Map className="test-class">Hello</Map>
  //     </MapContext.Provider>
  //   );

  //   expect(screen.getByText("Hello")).toBeInTheDocument();
  //   expect(screen.getByRole("generic")).toHaveClass("relative");
  //   expect(document.querySelector(".test-class")).toBeInTheDocument();
  // });

  // it("creates a map instance with expected options", () => {
  //   render(
  //     <MapContext.Provider value={{ setMap: vi.fn(), setMapLoaded: vi.fn() }}>
  //       <Map bearing={45} />
  //     </MapContext.Provider>
  //   );

  //   expect(MLMap).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       bearing: 45,
  //       zoom: 9,
  //       attributionControl: false,
  //     })
  //   );
  // });

  it("calls setMap and setMapLoaded on load", () => {
    const setMap = vi.fn();
    const setMapLoaded = vi.fn();

    render(
      <MapContext.Provider value={{ setMap, setMapLoaded }}>
        <Map />
      </MapContext.Provider>
    );

    expect(setMap).toHaveBeenCalled(MLMap);
    expect(setMapLoaded).toHaveBeenCalledWith(true);
  });

  it("cleans up on unmount", () => {
    const setMap = vi.fn();
    const setMapLoaded = vi.fn();

    const { unmount } = render(
      <MapContext.Provider value={{ setMap, setMapLoaded }}>
        <Map />
      </MapContext.Provider>
    );

    unmount();

    expect(setMap).toHaveBeenCalledWith(undefined);
    expect(setMapLoaded).toHaveBeenCalledWith(false);
  });
});
