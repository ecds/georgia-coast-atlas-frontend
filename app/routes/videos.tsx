import { useLoaderData } from "react-router";
import type { LoaderFunction } from "react-router";
import { fetchDataBySlugFromTopics } from "~/data/coredata.ts";

// Define the video type
type Video = {
  embed_url: string; // Video URL
  name: string; // Video title
};

export const loader: LoaderFunction = async () => {
  const topic = "interviews"; // Topic slug to fetch
  try {
    const data = await fetchDataBySlugFromTopics(topic);

    if (!data || !data.videos) {
      throw new Error("No video data available.");
    }

    return { videos: data.videos };
  } catch (error) {
    console.error(error);
    throw new Response("Error loading interviews data", { status: 500 });
  }
};

const Videos = () => {
  const { videos } = useLoaderData<{ videos: Video[] }>();

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(64, 62, 62, 0.8), rgba(73, 103, 76, 0.7)), url(/images/wassaw.jpeg)",
      }}
    >
      {/* Grey Overlay */}
      <div className="absolute inset-0 bg-gray-800 bg-opacity-50"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 text-white">
        <h1 className="text-4xl font-bold text-white mb-6">
          About the Islands
        </h1>
        <p className="text-lg text-gray-200 mb-4 text-center">
          Interview excerpts from the Coastal Nature, Coastal Culture symposium
          February 18-20, 2016 Savannah, Georgia.
        </p>
        <p className="text-lg text-gray-200 mb-12 text-center max-w-3xl">
          The team interviewed six presenters with expertise on the
          environmental histories of the Georgia coast. These excerpts provide
          an introduction to the industry, culture, and ecology of this dynamic
          environment.
        </p>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div key={index} className="flex flex-col items-center">
              <iframe
                src={video.embed_url} // Dynamically use embed_url
                width="480"
                height="270"
                allow="autoplay; fullscreen"
                allowFullScreen
                title={video.name} // Use video title as iframe title
                className="rounded-md"
              ></iframe>
              <p className="text-center mt-2 text-lg">{video.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Videos;
