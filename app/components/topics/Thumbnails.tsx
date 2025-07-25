import { Link } from "react-router";
import Heading from "../layout/Heading";
import type { ESRelatedMedium } from "~/esTypes";

interface Props {
  items: ESRelatedMedium[] | undefined;
  mediaType: "videos" | "photographs" | "panos" | "maps";
  topic: string;
}

const Thumbnails = ({ items, mediaType, topic }: Props) => {
  if (items && items.length > 0) {
    return (
      <>
        <Heading as="h2" className="md:mx-8 text-2xl capitalize">
          {mediaType}
        </Heading>
        <ul className="flex flex-col md:flex-row flex-wrap items-center md:items-start justify-center">
          {items.map((item) => (
            <li
              key={item.uuid}
              className="w-56 md:w-64 lg:w-72 xl:w-80  md:ms-2 md:mx-4 lg:mx-6"
            >
              <Link
                to={`/collections/${mediaType}/${item.slug}`}
                state={{ backTo: `Back to ${topic}` }}
              >
                <div
                  className={`flex mx-auto px-2 md:px-0  aspect-${mediaType === "photographs" || mediaType === "maps" ? "square" : "video"} w-56 md:w-64 lg:w-72 xl:w-80 md:mb-auto mt-6 md:mt-12 lg:mt-6 flex-col md:flex-row lg:flex-col items-center md:items-start md:space-x-4 lg:space-x-0 bg-cover bg-no-repeat bg-center rounded-md drop-shadow-lg`}
                  style={{ backgroundImage: `url(${item.thumbnail_url})` }}
                >
                  <div
                    className="sr-only tracking-loose my-2 text-sm"
                    dangerouslySetInnerHTML={{
                      __html: item.description ?? "",
                    }}
                  />
                </div>
              </Link>
              <h2 className="text-sm text-black mb-2 xl:my-2 truncate md:text-wrap">
                {item.title ?? item.name}
              </h2>
            </li>
          ))}
        </ul>
      </>
    );
  }

  return null;
};

export default Thumbnails;
