const LoopVideoGB = () => {
  const video = `https://georgia-coast-atlas-static-resources.s3.us-east-1.amazonaws.com/loop-videos/${Math.floor(Math.random() * 6)}.mp4`;
  return (
    <video
      autoPlay
      loop
      muted
      className="absolute top-0 left-0 w-full h-full object-cover z-1"
    >
      <source src={video} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default LoopVideoGB;
