import { redirect } from "react-router";

export const loader = () => {
  return redirect("/about/project", 301);
};
