import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@remix-run/react";

const Loading = () => {
  const navigation = useNavigation();
  return (
    <div
      className={`absolute flex items-center text-center h-screen w-screen top-0 z-50 bg-black/50 transition-opacity duration-700 ${navigation.state == "loading" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    >
      <div className="relative grow text-6xl text-white">
        <FontAwesomeIcon
          icon={faSpinner}
          spin={navigation.state == "loading"}
        />{" "}
        Loading
      </div>
    </div>
  );
};

export default Loading;
