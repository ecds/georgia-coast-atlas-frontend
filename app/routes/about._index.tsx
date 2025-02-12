import { dataHosts } from "~/config";
import { useLoaderData } from "@remix-run/react";
import "~/styles/about.css";
import type { TWordPressData } from "~/types";

export const loader = async () => {
  const wpResponse = await fetch(
    `https://${dataHosts.wordPress}/wp-json/wp/v2/pages/?slug=about`
  );

  const wpData: TWordPressData[] = await wpResponse.json();

  return { wpData: wpData[0] };
};

const About = () => {
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

export default About;
