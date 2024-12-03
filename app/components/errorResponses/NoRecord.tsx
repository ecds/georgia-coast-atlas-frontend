import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const NoRecord = ({ children }: Props) => {
  return (
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl">
          No Record
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48">
          {children}
        </p>
      </div>
    </section>
  );
};

export default NoRecord;
