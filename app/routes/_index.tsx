import type { MetaFunction } from "@remix-run/node";
import IntroModal from "app/components/layout/IntroModal";

export const meta: MetaFunction = () => {
  return [
    { title: "Georgia Coast Atlas" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div>
      <IntroModal />
      {}
    </div>
  );
}
