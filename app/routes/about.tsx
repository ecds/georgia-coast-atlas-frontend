import backgroundImage from "~/images/ossabaw.jpeg"; 
import Navbar from "~/components/layout/Navbar"; 

const About = () => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center font-barlow"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-[#4A5D41] bg-opacity-50"></div> 

      <Navbar />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white">

        <h1 className="text-5xl font-bold text-white mb-8 z-20 relative text-center"
            style={{ fontFamily: "Barlow, sans-serif" }}>
          ABOUT THE GEORGIA COAST ATLAS
        </h1>

        <div className="bg-[#4A5D41] bg-opacity-90 p-12 rounded-lg max-w-5xl mx-auto"
              style={{ fontFamily: "Barlow, sans-serif" }}>
          <p className="text-lg text-center mb-8">
            A partnership between <a href="https://envs.emory.edu/" className="text-blue-300 font-bold">Emory's University's Department of Environmental Sciences </a> 
            and <a href="https://ecds.emory.edu/" className="text-blue-300 font-bold">Emory's Center for Digital Scholarship</a>, 
            The Georgia Coast Atlas project attempts to redefine the concept of a traditional atlas, instead using digital scholarship to explore the ecological and geographic dimensions of the Georgia coast.
            Through this atlas, we plan to combine various forms of digital media with scholarly content to produce a website that we anticipate will be of great value to educators, conservationists, students, and the general public.
          </p>

          <div className="mt-12">
            <h3 className="text-3xl font-bold text-center mb-6">TEAM MEMBERS</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-10">
                <div className="text-right text-xl">ANTHONY (TONY) MARTIN</div>
                <div className="text-left">Faculty Project Leader, Professor of Practice, Department of Environmental Sciences</div>
              </div>
              <div className="grid grid-cols-2 gap-x-10">
                <div className="text-right text-xl">MICHAEL PAGE</div>
                <div className="text-left">GIS Specialist, Emory Center for Digital Scholarship & Lecturer, Department of Environmental Sciences</div>
              </div>
              <div className="grid grid-cols-2 gap-x-10">
                <div className="text-right text-xl">STEVE BRANSFORD</div>
                <div className="text-left">Project Coordinator, Emory Center for Digital Scholarship</div>
              </div>
              <div className="grid grid-cols-2 gap-x-10">
                <div className="text-right text-xl">JAY VARNER</div>
                <div className="text-left">Software Developer, Emory Center for Digital Scholarship</div>
              </div>
              <div className="grid grid-cols-2 gap-x-10">
                <div className="text-right text-xl">BAILEY BETIK</div>
                <div className="text-left">Web Designer, Emory Center for Digital Scholarship</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-12">
            <div>
              <h3 className="text-2xl font-bold text-center mb-4">STUDENTS</h3>
              <ul className="list-none text-center space-y-2">
                <li>Cassiel Chen</li>
                <li>Dana Kahn</li>
                <li>Veda Varshith Sai Chidalla </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-center mb-4">FORMER TEAM MEMBERS</h3>
              <ul className="list-none text-center space-y-2">
                <li>Anandi Salinas</li>
                <li>Alan Pike</li>
                <li>Shannon O'Daniel</li>
                <li>Jared Gingrich</li>
                <li>Saundra Barrett</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
