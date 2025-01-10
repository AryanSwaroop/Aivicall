import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import API_ENDPOINTS from "../../api/endpoints";

const popVariants = {
  hidden: {
    y: -1000,
    opacity: 0,
  },

  visible: {
    y: -100,
    opacity: 1,
  },

  exit: {
    y: -1000,
    transition: {
      ease: "easeOut",
    },
  },
};

const google = () => {
  window.open(API_ENDPOINTS.BACK_CALLBACK, "_self");
};

export default function Body() {
  const LoadForm = () => {
    window.location.href = "/form";
  };

  const [popStatus, setStatus] = useState(false);

  return (
    <div className="relative flex mt-20 flex-col items-center justify-center p-4">
      <h1 className="text-5xl text-center font-bold text-gray-700">
        Complete Your Projects With <br /> Friends And AI
      </h1>
      <motion.button
        className="bg-blue-600 text-white py-3 px-6 mt-5 rounded-lg flex items-center hover:scale-110 transition"
        whileHover={{ scale: 1.1 }}
        onClick={(e) => {
          setStatus(true);
        }}
      >
        Get Started
        <img src="icons/startedArrow.svg" className="ml-2 w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {popStatus && (
          <motion.div
            className="fixed z-10 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-xl"
            variants={popVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
              Login/SignUp
            </h1>

            <button
              className="flex justify-center items-center bg-white border border-gray-300 rounded-lg p-3 w-full"
              onClick={google}
            >
              <motion.img
                src="icons/google.svg"
                className="w-6 h-6 mr-2"
                whileHover={{ rotate: -360 }}
              />
              <span className="text-lg font-medium text-gray-700">
                Continue with Google
              </span>
            </button>

            <a
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={LoadForm}
            >
              Manually
            </a>
          </motion.div>
        )}

        {popStatus && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={(e) => {
            setStatus(false);
          }}
        ></div>
      )}

      </AnimatePresence>

    </div>
  );
}
