import Navbar from "~/components/layout/Navbar";
import { dataHosts } from "~/config";
import { useLoaderData } from "@remix-run/react";
import "~/styles/about.css";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { TWordPressData } from "~/types";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const wpResponse = await fetch(
    `https://${dataHosts.wordPress}/wp-json/wp/v2/pages/?slug=bibliography`
  );

  const wpData: TWordPressData[] = await wpResponse.json();

  let heading = "";
  if (wpData[0]?.content?.rendered) {
    // Extract and remove the heading from the content
    const headingMatch = wpData[0].content.rendered.match(/<h2[^>]*>(.*?)<\/h2>/);
    if (headingMatch) {
      heading = headingMatch[1];
      wpData[0].content.rendered = wpData[0].content.rendered.replace(
        headingMatch[0],
        ""
      );
    }
  }

  return { wpData: wpData[0], heading };
};

const Bibliography = () => {
  const { wpData, heading } = useLoaderData<{
    wpData: TWordPressData;
    heading: string;
  }>();

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(30, 30, 30, 0.9), rgba(30, 30, 30, 0.8)), url(/images/ossabaw.jpeg)",
      }}
    >
      <Navbar />
      {heading && (
        <h2
          className="text-white text-5xl font-extrabold mt-10 tracking-wide"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          {heading}
        </h2>
      )}
      <div
        className="bg-costal-green text-white rounded-xl shadow-lg px-12 lg:px-20 py-16 w-[90%] sm:w-[80%] md:w-[75%] lg:w-[60%] xl:w-[55%] mt-10"
        style={{
          fontFamily: "'Barlow', sans-serif", // Use Barlow font
        }}
      >
        <div
          className="prose prose-xl prose-invert leading-loose tracking-wide custom-links"
          dangerouslySetInnerHTML={{
            __html: wpData?.content.rendered,
          }}
        />
      </div>
    </div>
  );
};

export default Bibliography;

