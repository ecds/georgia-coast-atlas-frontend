import { redirect } from "@remix-run/node";

export const loader = () => {
  return redirect("/islands", 301);
};

// export default ExplorePage;
