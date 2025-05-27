import React, { useCallback } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../../api/apiInstance";
import API_ENDPOINTS from "../../api/endpoints";

const cameraVariant = {
  hidden: {
    opacity: 0,
    pathLength: 0,
  },
  visible: {
    opacity: 1,
    pathLength: 1,
    transition: {
      duration: 3,
      ease: "easeInOut",
    },
  },
};

const Navbar = () => {
  const handleClearCookies = useCallback(() => {
    axiosInstance
      .post(API_ENDPOINTS.SIGNOUT)
      .then((res) => {
        console.log("Signed out:", res);
        window.location.href = "/";
      })
      .catch((err) => {
        console.error("Logout failed:", err);
      });
  }, []);

  const handleHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 h-20 bg-gradient-to-r from-black via-purple-900 to-black bg-opacity-90 backdrop-blur-md shadow-lg z-50">
      {/* Logo/Home Icon */}
      <svg
        onClick={handleHome}
        className="cursor-pointer w-10 h-10 hover:scale-110 transition-transform duration-200"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M14 11L17 9.5V14.5L14 13M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM8 15H13C13.5523 15 14 14.5523 14 14V10C14 9.44772 13.5523 9 13 9H8C7.44772 9 7 9.44772 7 10V14C7 14.5523 7.44772 15 8 15Z"
          stroke="#A855F7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={cameraVariant}
          initial="hidden"
          animate="visible"
        />
      </svg>

      {/* Logout Button */}
      {
        document.cookie.length > 0 && (
      <button
        onClick={handleClearCookies}
        className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md shadow-md transition-all duration-300"
      >
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;
