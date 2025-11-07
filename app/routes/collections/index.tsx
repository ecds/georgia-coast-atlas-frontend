import { redirect } from "react-router";

export const loader = () => {
  return redirect("/collections/maps", 301);
};
