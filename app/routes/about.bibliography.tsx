import Navbar from "~/components/layout/Navbar";
import { dataHosts } from "~/config";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { TWordPressData } from "~/types";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const wpResponse = await fetch(
    `https://${dataHosts.wordPress}/wp-json/wp/v2/pages/?slug=bibliography`
  );

  const wpData: TWordPressData[] = await wpResponse.json();
  return { wpData: wpData[0] };
};

const Bibliography = () => {
  const { wpData } = useLoaderData<{ wpData: TWordPressData }>();

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(64, 62, 62, 0.8), rgba(73, 103, 76, 0.7)), url(/images/ossabaw.jpeg)",
      }}
    >
      <Navbar />
      <div
        className="bg-costal-green text-white rounded-xl shadow-lg px-12 lg:px-20 py-16 w-[90%] sm:w-[80%] md:w-[75%] lg:w-[65%] xl:w-[55%] mt-10"
        style={{
          fontFamily: "'Barlow', sans-serif",
        }}
      >
        <div
          className="prose prose-xl prose-invert leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: wpData?.content.rendered,
          }}
        />
      </div>
    </div>
  );
};

export default Bibliography;
