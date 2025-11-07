import { useLoaderData } from "react-router";
import { dataHosts } from "~/config";
import wpCssUrl from "~/styles/about.css?url";
import type { LinksFunction, MetaFunction } from "react-router";
import type { TWordPressData } from "~/types";
import { placeMetaDefaults } from "~/utils/placeMetaTags";

export const loader = async () => {
  const wpResponse = await fetch(
    `https://${dataHosts.wordPress}/wp-json/wp/v2/pages/674`
  );

  const wpData: TWordPressData = await wpResponse.json();

  return { wpData };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: wpCssUrl }];
};

export const meta: MetaFunction = () => {
  return [
    {
      ...placeMetaDefaults,
      title: "About the Team: Georgia Coast Atlas",
    },
  ];
};

const TeamRoute = () => {
  const { wpData } = useLoaderData<{ wpData: TWordPressData }>();
  return (
    <div
      className="elementor-kit-40" // Class for WordPress CSS
      dangerouslySetInnerHTML={{
        __html: wpData?.content.rendered,
      }}
    />
  );
};

export default TeamRoute;
