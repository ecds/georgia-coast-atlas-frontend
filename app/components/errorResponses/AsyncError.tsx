import { useAsyncError } from "@remix-run/react";

const AsyncError = () => {
  const error = useAsyncError() as Error;
  return (
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-(--breakpoint-xl) text-center lg:py-16">
        <h1>Async: {error.message}</h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48">
          Stack Trace:
        </p>
        <div className="text-left">
          <pre>{error.stack}</pre>
        </div>
      </div>
    </section>
  );
};

export default AsyncError;
