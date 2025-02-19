const Contact = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(64, 62, 62, 0.8), rgba(73, 103, 76, 0.7)), url(/images/ossabaw.jpeg)",
      }}
    >
      <h2
        className="text-white text-3xl font-bold mt-12 mb-8"
        style={{ fontFamily: "'Barlow', sans-serif" }}
      >
        CONTACT
      </h2>
      <div
        className="bg-costal-green text-white rounded-xl shadow-lg px-10 lg:px-16 py-12 w-[85%] sm:w-[70%] md:w-[65%] lg:w-[50%] xl:w-[45%]"
        style={{
          fontFamily: "'Barlow', sans-serif", // Use the Barlow font
        }}
      >
        <form className="flex flex-col space-y-6">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-lg mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Name"
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-lg mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="message" className="text-lg mb-2">
              Message
            </label>
            <textarea
              id="message"
              placeholder="Message"
              rows={5}
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black resize-none"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
