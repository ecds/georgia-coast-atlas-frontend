import { useEffect, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import { videosIndexCollection } from "~/config";
import { fetchBySlug } from "~/data/coredata";
import ClientOnly from "~/components/ClientOnly";
import Map from "~/components/mapping/Map.client";
import SharedMapOverlay from "~/components/collections/SharedMapOverlay";
import Item from "~/components/collections/Item";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import Heading from "~/components/layout/Heading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { collectionMetadata } from "~/utils/collectionMetaTags";
import type { LoaderFunctionArgs } from "react-router";
import type { ESCollectionItem } from "~/esTypes";

export const meta = ({ data }: { data: { video: ESCollectionItem } }) => {
  const { video } = data;

  const previewImage = video.thumbnail_url;

  return collectionMetadata({
    title: video.title ?? video.name,
    description: video.description ?? "A video from the Georgia Coast Atlas.",
    image: previewImage,
    slug: `video/${video.slug}`,
  });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const video = await fetchBySlug(params.video, videosIndexCollection);

  if (!video) {
    throw new Response(null, { status: 404, statusText: "Video not found" });
  }

  return { video };
};

const VideoDetail = () => {
  const { video } = useLoaderData<typeof loader>();
  const [backTo, setBackTo] = useState("Back to Video Collection");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setBackTo(location.state.backTo);
  }, [location]);

  return (
    <Item className="grid grid-cols-3 mx-2 md:mx-auto w-3/4">
      <div className="col-span-3">
        <button
          className="text-sm text-activeCounty underline hover:font-semibold capitalize"
          onClick={() => navigate(-1)}
        >
          {backTo}
        </button>
        <div className=" mx-auto">
          <iframe
            title={video.uuid}
            src={video.embed_url}
            allowFullScreen
            className="w-full aspect-video bg-black/60"
          />
          <h1 className="text-lg text-black/85">{video.name}</h1>
        </div>
        <div dangerouslySetInnerHTML={{ __html: video.description ?? "" }} />
      </div>
      {video.transcript && (
        <div className="col-span-3">
          <div className=" mx-auto">
            <Disclosure>
              {({ open }) => (
                <>
                  <DisclosureButton
                    className={`bg-county/25 px-4 rounded-sm group flex w-full items-center justify-between`}
                  >
                    <Heading as="h3">Transcript</Heading>
                    <FontAwesomeIcon icon={open ? faMinus : faPlus} />
                  </DisclosureButton>
                  <DisclosurePanel className="bg-county/10 px-4">
                    <div
                      className="font-light leading-loose tracking-wide"
                      dangerouslySetInnerHTML={{
                        __html: video.transcript ?? "",
                      }}
                    />
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
      )}
      {video.places?.length > 0 && (
        <div className="mt-8 col-span-3">
          <div className=" mx-auto">
            <div className="mt-8 h-[500px] w-full rounded-md overflow-hidden">
              <ClientOnly>
                <Map className="w-96 h-96">
                  <SharedMapOverlay places={video.places} />
                </Map>
              </ClientOnly>
            </div>
          </div>
        </div>
      )}
    </Item>
  );
};

export default VideoDetail;
