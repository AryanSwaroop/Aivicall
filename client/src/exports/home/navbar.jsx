import React from "react";
import { motion } from "framer-motion";

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
  const handleHoom = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex h-20.5 items-center justify-start p-4 bg-white shadow-md">
      <svg
        onClick={handleHoom}
        className="navbarIcon cursor-pointer w-10 h-10 hover:scale-110 transition-transform"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M14 11L17 9.5V14.5L14 13M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM8 15H13C13.5523 15 14 14.5523 14 14V10C14 9.44772 13.5523 9 13 9H8C7.44772 9 7 9.44772 7 10V14C7 14.5523 7.44772 15 8 15Z"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={cameraVariant}
          initial="hidden"
          animate="visible"
        />
      </svg>
    </div>
  );
};

export default Navbar;
