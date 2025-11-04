// Heading.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Heading from "./Heading";

type heading = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

describe("Heading component", () => {
  const text = "Test Heading";

  describe.each([
    ["h1", "text-2xl"],
    ["h2", "text-xl"],
    ["h3", "text-lg"],
    ["h4", "text-lg"],
    ["h5", "text-lg"],
    ["h6", "text-lg"],
  ])("when rendered as %s", (tag, defaultClass) => {
    it("applies the correct tag and default class", () => {
      const { container } = render(
        <Heading as={tag as heading}>{text}</Heading>
      );
      const element = screen.getByText(text);

      expect(element.tagName.toLowerCase()).toBe(tag);
      expect(element).toHaveClass(defaultClass);

      // snapshot for each heading tag
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it("uses custom className instead of default", () => {
    const { container } = render(
      <Heading as="h1" className="custom-class">
        {text}
      </Heading>
    );
    const element = screen.getByText(text);
    expect(element).toHaveClass("custom-class");
    expect(element).not.toHaveClass("text-2xl");

    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders children correctly", () => {
    const { container } = render(<Heading as="h2">Hello World</Heading>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders default fallback when an invalid tag is passed", () => {
    const { container } = render(<Heading as="invalid">{text}</Heading>);
    const element = screen.getByText(text);
    expect(element.tagName.toLowerCase()).toBe("div");
    expect(element).toHaveClass("text-base");

    expect(container.firstChild).toMatchSnapshot();
  });
});
