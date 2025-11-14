const Topics = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white h-4"></div>

      <header
        className="bg-cover bg-center text-white py-32"
        style={{
          backgroundImage:
            "url('https://wp.georgiacoastatlas.org/wp-content/uploads/2024/11/john-boehm-msp8TUZN4II-unsplash-scaled.jpg')",
        }}
      >
        <div className="bg-costal-green/80 p-10 rounded-lg shadow-md max-w-4xl mx-auto text-center">
          <h1
            className="text-5xl font-extrabold tracking-wide uppercase"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          >
            Historic Sites
          </h1>
          <p className="text-lg mt-4">General overview or intro here</p>
        </div>
      </header>

      <main className="space-y-16 mt-8">
        {/* Plantations */}
        <section
          className="bg-cover bg-center text-white py-24 flex justify-end"
          style={{
            backgroundImage:
              "url('https://wp.georgiacoastatlas.org/wp-content/uploads/2024/11/ashley-knedler-9SW9IvKD9OY-unsplash-scaled.jpg')",
          }}
        >
          <div className="max-w-4xl relative">
            <h2 className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-4xl font-bold uppercase">
              Plantations
            </h2>
            <div className="bg-costal-green/80 p-10 rounded-lg shadow-md">
              <p className="text-center mb-6">Intro to plantations</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="/topics/plantations"
                  className="bg-[#94C1E1] hover:bg-blue-400 text-black px-6 py-3 rounded-lg text-center font-bold"
                >
                  Individal Plantations
                </a>
                <a
                  href="https://dev.georgiacoastatlas.org/search?georgia_coast_places%5BrefinementList%5D%5Btypes%5D%5B0%5D=Plantation"
                  className="bg-[#94C1E1] hover:bg-blue-400 text-black px-6 py-3 rounded-lg text-center font-bold"
                >
                  Curated list of plantation sites
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Forts */}
        <section
          className="bg-cover bg-center text-white py-24 flex justify-start"
          style={{
            backgroundImage:
              "url('https://wp.georgiacoastatlas.org/wp-content/uploads/2024/11/michael-dziedzic-onz9wiEktIw-unsplash-scaled.jpg')",
          }}
        >
          <div className="max-w-4xl relative">
            <h2 className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-4xl font-bold uppercase">
              Forts
            </h2>
            <div className="bg-costal-green/80 p-10 rounded-lg shadow-md">
              <p className="text-center mb-6">Intro to forts</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="/forts/individual"
                  className="bg-[#94C1E1] hover:bg-blue-400 text-black px-6 py-3 rounded-lg text-center font-bold"
                >
                  Link to individual fort pages
                </a>
                <a
                  href="/forts/list"
                  className="bg-[#94C1E1] hover:bg-blue-400 text-black px-6 py-3 rounded-lg text-center font-bold"
                >
                  Link to curated list of fort sites
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Battlesites */}
        <section
          className="bg-cover bg-center text-white py-24 flex justify-end"
          style={{
            backgroundImage:
              "url('https://wp.georgiacoastatlas.org/wp-content/uploads/2024/11/eddie-wingertsahn-NZRlnp16k3w-unsplash-scaled.jpg')",
          }}
        >
          <div className="max-w-4xl relative">
            <h2 className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-4xl font-bold uppercase">
              Battlesites
            </h2>
            <div className="bg-costal-green/80 p-10 rounded-lg shadow-md">
              <p className="text-center mb-6">Intro to battlesites</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="/battlesites/individual"
                  className="bg-[#94C1E1] hover:bg-blue-400 text-black px-6 py-3 rounded-lg text-center font-bold"
                >
                  Link to individual battlesite pages
                </a>
                <a
                  href="/battlesites/list"
                  className="bg-[#94C1E1] hover:bg-blue-400 text-black px-6 py-3 rounded-lg text-center font-bold"
                >
                  Link to curated list of battlesite sites
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Topics;
