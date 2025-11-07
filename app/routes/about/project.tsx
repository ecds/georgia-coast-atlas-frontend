import { dataHosts } from "~/config";
import { useLoaderData } from "react-router";
import { placeMetaDefaults } from "~/utils/placeMetaTags";
import wpCssUrl from "~/styles/about.css?url";
import type { TWordPressData } from "~/types";
import type { LinksFunction, MetaFunction } from "react-router";

export const loader = async () => {
  const wpResponse = await fetch(
    `https://${dataHosts.wordPress}/wp-json/wp/v2/pages/?slug=about-project`
  );

  const wpData: TWordPressData[] = await wpResponse.json();

  return { wpData: wpData[0] };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: wpCssUrl }];
};

export const meta: MetaFunction = () => {
  return [
    {
      ...placeMetaDefaults,
      title: "About the Project: Georgia Coast Atlas",
    },
  ];
};

const ProjectPage = () => {
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

export default ProjectPage;
