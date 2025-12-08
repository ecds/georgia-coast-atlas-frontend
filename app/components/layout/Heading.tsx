import type { ReactNode } from "react";

interface Props {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | string;
  children: ReactNode;
  className?: string;
}

const Heading = ({ as, children, className }: Props) => {
  switch (as) {
    case "h1":
      return <h1 className={className ?? "text-2xl"}>{children}</h1>;
    case "h2":
      return <h2 className={className ?? "text-xl"}>{children}</h2>;
    case "h3":
      return <h3 className={className ?? "text-lg"}>{children}</h3>;
    case "h4":
      return <h4 className={className ?? "text-lg"}>{children}</h4>;
    case "h5":
      return <h5 className={className ?? "text-lg"}>{children}</h5>;
    case "h6":
      return <h6 className={className ?? "text-lg"}>{children}</h6>;
    default:
      return <div className={className ?? "text-base"}>{children}</div>;
  }
  return <></>;
};

export default Heading;
