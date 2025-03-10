import { faMap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@remix-run/react";
import type { Hit } from "instantsearch.js";

const MapPreview = ({ hit }: { hit: Hit }) => {
  return (
    <figure className="flex flex-row xl:flex-col space-x-4 xl:space-x-0 ms-2 mt-12 w-2/3">
      <img src={hit.preview_link} alt="" className="shadow-md w-48 h-48" />
      <figcaption className="text-sm text-black/75 col-span-2 px-2 xl:px-0 xl:pe-4">
        <h2 className="text-base text-black mb-2 xl:my-2">{hit.name}</h2>
        <p className="tracking-loose my-2">
          Velit quis veniam commodo fugiat proident officia aute exercitation
          dolor duis amet non reprehenderit. Elit dolore ut Lorem dolore
          adipisicing nostrud cillum irure esse esse ipsum incididunt. In sunt
          laborum do aliqua magna veniam irure enim id officia. Est non qui
          commodo esse.
        </p>
        <ul className="">
          <li className="">
            <span className="font-semibold">Date:</span> {hit.year}
          </li>
          <li className="">
            <span className="font-semibold">Places:</span>{" "}
            {hit.places.join(",")}
          </li>
          {hit.wms_resource && (
            <li className="mt-2">
              <Link
                to={hit.slug}
                className="t text-activeIsland border-2 border-island/50 px-2 py-1 rounded-md"
              >
                <FontAwesomeIcon icon={faMap} /> Show on Map
              </Link>
            </li>
          )}
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

export default MapPreview;
