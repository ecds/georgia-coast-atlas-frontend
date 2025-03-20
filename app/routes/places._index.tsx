import { redirect } from "@remix-run/node";

export const loader = () => {
  return redirect("/places/search", 301);
};
