import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { dataHosts } from "~/config";

export const loader = async () => {
  const response = await fetch(
    `https://${dataHosts.wordPress}/wp-json/wp/v2/pages/?slug=homepage`
  );
  const data = await response.json();
  return data[0] || null;
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const wpContent = useLoaderData<typeof loader>();

  return (
      <div
      dangerouslySetInnerHTML={{
        __html: wpContent.content.rendered,
      }}
    />
  );
}
