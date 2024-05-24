import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import IntroModal from "app/components/layout/IntroModal"

export const loader = async () => {
  const response = await fetch(
    "https://wp.georgiacoastatlas.org/wp-json/wp/v2/pages/?slug=homepage"
  );
  const data = await response.json();
  return data[0] || null;
};

export const meta: MetaFunction = () => {
  return [
    { title: "Georgia Coast Atlas" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const wpContent = useLoaderData<typeof loader>();

  return (
    <div>
    <div
      dangerouslySetInnerHTML={{
        __html: wpContent.content.rendered,
      }}
    />
    <IntroModal />{ }
    </div>
  );
}
