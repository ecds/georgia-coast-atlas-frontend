import { Link } from "@remix-run/react";
import type { Hit } from "instantsearch.js";

const VideoPreview = ({ hit }: { hit: Hit }) => {
  return (
    <figure className="flex flex-col md:flex-row lg:flex-col items-center md:items-start md:space-x-4 lg:space-x-0 lg:px-2 mb-6 md:mb-auto md:ms-2 md:mt-12 lg:mt-6 w-full ">
      <img src={hit.thumbnail_url} alt="" className="shadow-md w-full" />
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
        {/* <dl className="grid grid-cols-6 lg:grid-cols-8 xl:grid-cols-6 auto-rows-fr justify-items-start">
          <dt className="col-span-2 md:col-span-1 xl:col-span-1 font-semibold">
            Date
          </dt>
          <dd className="col-span-4 md:col-span-5 xl:col-span-5 lg:col-span-7">
            1990
          </dd>
          <dt className="col-span-2 md:col-span-1 xl:col-span-1 font-semibold">
            Places
          </dt>
          <dd className="col-span-4 md:col-span-5 xl:col-span-5 lg:col-span-7">
            {hit.places.join(",")}
          </dd>
        </dl> */}
        {/* <table className="table-auto mt-4">
          <tr>
            <td className="font-semibold">Date</td>
            <td className="px-4">1900</td>
          </tr>
          <tr>
            <td className="font-semibold">Places</td>
            <td className="px-4">{hit.places.join(",")}</td>
          </tr>
        </table> */}
      </figcaption>
    </figure>
  );
};

export default VideoPreview;
