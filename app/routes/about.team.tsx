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
    <div>
      <div
        className="bg-cover bg-center h-screen w-screen overflow-y-scroll"
        style={{
          backgroundImage:
            "linear-gradient(rgba(64, 62, 62, 0.9),rgba(73, 103, 76, 0.6)), url(/images/ossabaw.jpeg)",
        }}
      >
        <div
          className="elementor-kit-40" // Class for WordPress CSS
          dangerouslySetInnerHTML={{
            __html: wpData?.content.rendered,
          }}
        />
      </div>
    </div>
  );
};

export default TeamRoute;
