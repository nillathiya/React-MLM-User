import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const WelcomeCard = () => {
  const { currentUser: loggedInUser } = useSelector((state) => state.auth);

  return (
    <div
      className="card relative !p-6 sm:!p-8 shadow-2xl rounded-2xl h-full border border-white/20 transform overflow-hidden transition-all duration-300  hover:scale-95 mt-3"
      style={{
        backgroundImage: `url('assets/images/dashboard/bg-1.png')`,
        // backgroundSize: "cover",
        opacity: 1,
        backgroundPosition: "top right",
        backgroundRepeat: "no-repeat",
        // padding: "24px",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/80" />

      {/* Content */}
      <div className="relative flex flex-col h-full justify-between">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white !mb-5 drop-shadow-md">
            Welcome Back{" "}
            {loggedInUser && loggedInUser.username
              ? loggedInUser.username
              : "Guest"}{" "}
          </h3>
          <span className="text-md sm:text-lg text-gray-200 opacity-90 block !mb-4">
            Explore your dashboard and unlock new features!
          </span>
        </div>
        <button className="self-start bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold !py-2 !px-6 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md z-10">
          <Link to="/upgrade/member-topup">Upgrade Plan</Link>
        </button>
      </div>

      {/* Second image at bottom-right */}
      <img
        src="assets/images/dashboard/welcome.png"
        alt="Secondary decoration"
        className="absolute bottom-0 right-0 sm:w-32 sm:h-20 md:w-40 md:h-28 md:-translate-x-14 sm:max-w-[8rem] md:max-w-[10rem] opacity-15 sm:opacity-80 pointer-events-none"
      />

      {/* Shiny Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 shine" />
      </div>

      {/* CSS for Shine Effect */}
      <style jsx>{`
        .shine {
          background: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0) 45%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0) 55%
          );
          animation: shine 3s infinite;
          transform: translateX(-100%);
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default WelcomeCard;
