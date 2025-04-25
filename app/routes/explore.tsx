import { redirect } from "react-router";

export const loader = () => {
  return redirect("/islands", 301);
};

// export default ExplorePage;
