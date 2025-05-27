import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./navbar";
import axiosInstance from "../../api/apiInstance";
import API_ENDPOINTS from "../../api/endpoints";

const Login = () => {
  const [login, setLogin] = useState({
    Email: "",
    Password: "",
  });

  const setValue = (e) => {
    setLogin({
      ...login,
      [e.target.placeholder]: e.target.value,
    });
  };

  const sendLoginData = () => {
    axiosInstance
      .post(API_ENDPOINTS.MANUAL_LOGIN, login, {
        withCredentials: true  // Explicitly enable credentials for this request
      })
      .then((res) => {
        if (res.status === 200) {
          console.log("User logged in successfully");
          window.location.href = "/create";
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        if (err.response) {
          if (err.response.status === 404) {
            alert("Credential is incorrect");
            window.location.href = "/form";
          } else if (err.response.status === 500) {
            alert("Credential is incorrect");
            window.location.href = "/form";
          } else if (err.response.status === 401) {
            alert("Credential is incorrect");
            window.location.href = "/form";
          }
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendLoginData();
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-purple-950 to-black px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md bg-black/80 border border-purple-700 p-8 rounded-2xl shadow-[0_0_25px_rgba(128,0,255,0.7)]"
        >
          <h2 className="text-3xl font-extrabold text-center text-purple-400 mb-6">
            Welcome Back 👾
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              onChange={setValue}
              className="w-full px-4 py-3 mb-4 text-purple-100 bg-black border border-purple-600 rounded-xl placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={setValue}
              className="w-full px-4 py-3 mb-6 text-purple-100 bg-black border border-purple-600 rounded-xl placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-800 to-purple-600 text-white font-semibold rounded-xl hover:from-purple-900 hover:to-purple-700 transition duration-300 shadow-lg"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
