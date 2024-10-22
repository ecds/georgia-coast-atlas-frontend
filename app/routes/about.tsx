import Navbar from "~/components/layout/Navbar";
import { defer } from "@remix-run/node";
import { dataHosts } from "~/config";
import { useLoaderData } from "@remix-run/react";
import "~/styles/about.css";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { TWordPressData } from "~/types";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const wpResponse = await fetch(
    `https://${dataHosts.wordPress}/wp-json/wp/v2/pages/?slug=about`
  );

  const wpData: TWordPressData[] = await wpResponse.json();

  return defer({ wpData: wpData[0] });
};

const About = () => {
  const { wpData } = useLoaderData<{ wpData: TWordPressData }>();
  return (
    <div>
      <Navbar />
      <div
        className="elementor-kit-40" // Class for WordPress CSS
        dangerouslySetInnerHTML={{
          __html: wpData?.content.rendered,
        }}
      />
    </div>
  );
};

export default About;
