import { ClipLoader, BarLoader } from "react-spinners";

const colorMap = {
  blue: "#446ab4",
  red: "#e74c3c",
  green: "#2ecc71",
  yellow: "#f1c40f",
  black: "#000000",
  white: "#ffffff",
};

const Loader = ({ size = 40, color = "blue", loader = "ClipLoader", fullPage = false }) => {
  const mappedColor = colorMap[color.toLowerCase()] || color;

  return (
    <div
      className={`flex items-center justify-center transition-opacity duration-300 ${
        fullPage
          ? "fixed inset-0 z-50 bg-gray-900 bg-opacity-50 backdrop-blur-md"
          : "py-4"
      }`}
    >
      {loader === "ClipLoader" ? (
        <ClipLoader size={size} color={mappedColor} />
      ) : (
        <BarLoader width={size * 2} height={size / 4} color={mappedColor} />
      )}
    </div>
  );
};

export default Loader;
