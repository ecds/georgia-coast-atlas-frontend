import { worksIndexCollection } from "~/config";
import { useLoaderData } from "@remix-run/react";
import { elasticSearchPost } from "~/data/coredata";

type TWork = {
  citation: string;
  uuid: string;
};

export const loader = async () => {
  const works: TWork[] = await elasticSearchPost({
    body: {
      size: 500,
      from: 0,
      _source: {
        includes: ["citation", "uuid"],
      },
      sort: [{ author: "asc" }],
    },
    collection: worksIndexCollection,
  });

  return { works };
};

const Bibliography = () => {
  const { works } = useLoaderData<typeof loader>();

  return (
    <div
      className="h-topOffset bg-cover bg-top flex flex-col items-center overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(30, 30, 30, 0.9), rgba(30, 30, 30, 0.8)), url(/images/ossabaw.jpeg)",
      }}
    >
      <h2 className="text-white text-5xl font-extrabold mt-10 tracking-wide font-barlow uppercase">
        Bibliography
      </h2>
      <div className="bg-costal-green font-barlow text-white rounded-xl shadow-lg px-12 lg:px-20 py-8 w-[90%] sm:w-[80%] md:w-[75%] lg:w-[60%] xl:w-[55%] mt-10 overflow-auto">
        {works.map((work) => {
          return (
            <div
              key={work.uuid}
              className="prose prose-xl prose-invert leading-loose tracking-wide custom-links -indent-6"
              dangerouslySetInnerHTML={{
                __html: work.citation,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Bibliography;
