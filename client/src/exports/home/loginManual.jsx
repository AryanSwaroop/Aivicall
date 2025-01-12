import { useState } from "react";
import Navbar from "./navbar";
import axios from 'axios';
import API_ENDPOINTS from "../../api/endpoints";
import axiosInstance from "../../api/apiInstance";

const Login = () => {
  const [login, setLogin] = useState({
    Email: "",
    Password: "",
  });

  const loadSignup = () => {
    window.location.href = "/login";
  }

  const setValue = (e) => {
    setLogin({
      ...login,
      [e.target.placeholder]: e.target.value,
    });
  };

  const sendLoginData = () => {

    axiosInstance
      .post(API_ENDPOINTS.MANUAL_LOGIN , login)
      .then((res) => {
        if(res.status === 200) {
          console.log("User registered successfully");
          window.location.href = "/create";
        }
      })
      .catch((err) => {
        console.log(err);
      });

  }

  const handleSubmit = (e) => {
    sendLoginData();
    e.preventDefault();
    console.log(login);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen">
      <form
        className="w-full mb-20 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >

        <input
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Email"
          onChange={(e) => setValue(e)}
        />
        <input
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="Password"
          onChange={(e) => setValue(e)}
        />

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          type="submit"
        >
          Login
        </button>
      </form>
      </div>
    </>
  );
};

export default Login;
