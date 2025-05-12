import { useLoaderData } from "@remix-run/react";
import { videosIndexCollection } from "~/config";
import { fetchBySlug } from "~/data/coredata";
import type { LoaderFunctionArgs } from "react-router";
import ClientOnly from "~/components/ClientOnly";
import Map from "~/components/mapping/Map";
import SharedMapOverlay from "~/components/collections/SharedMapOverlay";
import Item from "~/components/collections/Item";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const video = await fetchBySlug(params.video, videosIndexCollection);

  if (!video) {
    throw new Response(null, {
      status: 404,
      statusText: "Video not found",
    });
  }

  return { video };
};

const VideoDetail = () => {
  const { video } = useLoaderData<typeof loader>();

  return (
    <Item itemType="video">
      <div className="relative pb-[56.2%] h-0 overflow-hidden max-w-full">
        <iframe
          title={video.uuid}
          src={video.embed_url}
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full bg-black/60"
        />
      </div>
      <div>
        <h1 className="text-lg text-black/85">{video.name}</h1>
        <div
          dangerouslySetInnerHTML={{
            __html: video.description ?? "",
          }}
        />
      </div>
      {video.places?.length > 0 && (
        <div className="mt-8 h-[500px] w-full rounded-md overflow-hidden">
          <ClientOnly>
            <Map className="w-96 h-96">
              <SharedMapOverlay places={video.places} />
            </Map>
          </ClientOnly>
        </div>
      )}
    </Item>
  );
};

export default VideoDetail;
