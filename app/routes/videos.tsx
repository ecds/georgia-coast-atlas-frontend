import Navbar from "~/components/layout/Navbar";
import backgroundImage from "~/images/wassaw.jpeg"; // Import the new background image

const Videos = () => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Grey Overlay to lighten the background */}
      <div className="absolute inset-0 bg-gray-800 bg-opacity-50"></div>

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 text-white">
        <h1 className="text-4xl font-bold text-white mb-6">About the Islands</h1>
        <p className="text-lg text-gray-200 mb-4 text-center">
          Interview excerpts from the Coastal Nature, Coastal Culture symposium February 18-20, 2016 Savannah, Georgia.
        </p>
        <p className="text-lg text-gray-200 mb-12 text-center max-w-3xl">
          The team interviewed six presenters with expertise on the environmental histories of the Georgia coast. These excerpts
          provide an introduction to the industry, culture, and ecology of this dynamic environment.
        </p>

        {/* Video Grid - Reducing the video size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://player.vimeo.com/video/160137732"
              width="480" // Reduced width
              height="270" // Reduced height
              allow="autoplay; fullscreen"
              allowFullScreen
              title="William Boyd interview excerpt"
            ></iframe>
            <p className="text-center mt-2">William Boyd interview excerpt - ECDS</p>
          </div>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://player.vimeo.com/video/160137451"
              width="480"
              height="270"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Max Edelson interview excerpt"
            ></iframe>
            <p className="text-center mt-2">Max Edelson interview excerpt - ECDS</p>
          </div>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://player.vimeo.com/video/160137347"
              width="480"
              height="270"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Edda Fields-Black interview excerpt"
            ></iframe>
            <p className="text-center mt-2">Edda Fields-Black interview excerpt - ECDS</p>
          </div>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://player.vimeo.com/video/160137193"
              width="480"
              height="270"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Tiya Miles interview excerpt"
            ></iframe>
            <p className="text-center mt-2">Tiya Miles interview excerpt - ECDS</p>
          </div>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://player.vimeo.com/video/160136752"
              width="480"
              height="270"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Janisse Ray interview excerpt"
            ></iframe>
            <p className="text-center mt-2">Janisse Ray interview excerpt - ECDS</p>
          </div>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://player.vimeo.com/video/160137071"
              width="480"
              height="270"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Mart Stewart interview excerpt"
            ></iframe>
            <p className="text-center mt-2">Mart Stewart interview excerpt - ECDS</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Videos;
