import type { ReactNode } from "react";

interface Props {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: ReactNode;
  className?: string;
}

const Heading = ({ as, children, className }: Props) => {
  switch (as) {
    case "h1":
      return <h1 className={`text-2xl ${className ?? ""}`}>{children}</h1>;
    case "h2":
      return <h2 className={`text-xl ${className ?? ""}`}>{children}</h2>;
    case "h3":
      return <h3 className={`text-lg ${className ?? ""}`}>{children}</h3>;
    case "h4":
      return <h4 className={`text-lg ${className ?? ""}`}>{children}</h4>;
    case "h5":
      return <h5 className={`text-lg ${className ?? ""}`}>{children}</h5>;
    case "h6":
      return <h6 className={`text-lg ${className ?? ""}`}>{children}</h6>;
    default:
      return <div className={`text-base ${className ?? ""}`}>{children}</div>;
  }
  return <></>;
};

export default Heading;
