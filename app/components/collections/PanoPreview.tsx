import { Link } from "@remix-run/react";
import type { Hit } from "instantsearch.js";

const PanoPreview = ({ hit }: { hit: Hit }) => {
  return (
    <Link to={`/collections/panos/${hit.slug}`}>
      <figure className="flex flex-col md:flex-row lg:flex-col items-center md:items-start md:space-x-4 lg:space-x-0 lg:px-2 mb-6 md:mb-auto md:ms-2 md:mt-12 lg:mt-6 w-full">
        <img src={hit.preview_link} alt="" className="shadow-md w-48" />
        <figcaption className="text-sm text-black/75 md:col-span-2 md:px-2 lg:px-0 lg:pe-4 w-full">
          <h2 className="text-lg md:text-base text-black mb-2 xl:my-2 truncate">
            {hit.name}
          </h2>
          <p className="tracking-loose my-2">{hit.description}</p>
          <ul className="">
            <li className="">
              <span className="font-semibold">Places:</span>{" "}
              {hit.places.join(",")}
            </li>
          </ul>
        </figcaption>
      </figure>
    </Link>
  );
};

export default PanoPreview;
