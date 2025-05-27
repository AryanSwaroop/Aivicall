import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import API_ENDPOINTS from "../../api/endpoints";

const popVariants = {
  hidden: { y: -1000, opacity: 0 },
  visible: {
    y: "-50%",
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    y: -1000,
    opacity: 0,
    transition: { duration: 0.4, ease: "easeIn" },
  },
};

const google = () => {
  window.open(API_ENDPOINTS.BACK_CALLBACK, "_self");
};

export default function Body() {
  const [popStatus, setStatus] = useState(false);

  const LoadForm = () => {
    window.location.href = "/form";
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black px-4 py-16 text-center">
      {/* Hero Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-700 drop-shadow-lg leading-tight">
        Complete Your Projects With <br /> Friends And AI
      </h1>

      {/* CTA Button */}
      <motion.button
        className="mt-10 bg-gradient-to-r from-purple-700 to-purple-500 text-white py-3 px-8 rounded-xl flex items-center hover:scale-105 hover:shadow-purple-700/50 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        onClick={() => {if (document.cookie.length > 0){window.location.href = "/create"} else {setStatus(true)}}}
      >
        Get Started
        <img src="icons/startedArrow.svg" alt="arrow" className="ml-3 w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {popStatus && (
          <>
            {/* Modal Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-70 z-10"
              onClick={() => setStatus(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Content */}
            <motion.div
              className="fixed z-20 top-1/2 w-[90%] max-w-md transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-black to-purple-900 border border-purple-700 p-8 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.4)]"
              variants={popVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className="text-2xl font-bold mb-6 text-purple-200">
                Login / Sign Up
              </h2>

              <button
                onClick={google}
                className="flex justify-center items-center bg-black hover:bg-purple-950 border border-purple-700 rounded-lg p-3 w-full transition duration-300"
              >
                <motion.img
                  src="icons/google.svg"
                  alt="Google icon"
                  className="w-6 h-6 mr-3"
                  whileHover={{ rotate: -360, transition: { duration: 0.6 } }}
                />
                <span className="text-lg font-medium text-purple-100">
                  Continue with Google
                </span>
              </button>

              <div className="mt-6 text-center">
                <span className="text-purple-300">or</span>
                <a
                  onClick={LoadForm}
                  className="ml-1 text-purple-400 hover:text-purple-300 font-medium cursor-pointer hover:underline"
                >
                  Login manually
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
