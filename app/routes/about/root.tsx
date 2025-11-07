import { Outlet } from "react-router";

const AboutRoot = () => {
  return (
    <div
      className="bg-cover bg-top flex flex-col items-center bg-fixed"
      style={{
        backgroundImage:
          "linear-gradient(rgba(30, 30, 30, 0.9), rgba(30, 30, 30, 0.8)), url(/images/ossabaw.jpeg)",
      }}
    >
      <Outlet />
    </div>
  );
};

export default AboutRoot;
