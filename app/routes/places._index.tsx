import { redirect } from "react-router";

export const loader = () => {
  return redirect("/places/search", 301);
};
