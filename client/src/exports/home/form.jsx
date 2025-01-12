import { useState } from "react";
import Navbar from "./navbar";
import axios from 'axios';
import API_ENDPOINTS from "../../api/endpoints";
import axiosInstance from "../../api/apiInstance";


const Form = () => {
  const [login, setLogin] = useState({
    FirstName: "",
    LastName: "",
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

  const sendSignup = () => {

    axiosInstance
      .post(API_ENDPOINTS.MANUAL_REGISTER, login)
      .then((res) => {
        console.log("User registered successfully");
      })
      .catch((err) => {
        console.log(err);
      });

      window.location.href = "/login";

  }

  const handleSubmit = (e) => {
    sendSignup();
    e.preventDefault();
    console.log(login);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen">
      <form
        className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="flex gap-4 mb-4">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="FirstName"
            onChange={(e) => setValue(e)}
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="LastName"
            onChange={(e) => setValue(e)}
          />
        </div>

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
          SignUp
        </button>
      </form>
      <a
        className="mt-5 text-blue-500 cursor-pointer hover:underline"
          onClick={loadSignup}
          >
          Not New ? Login Here
      </a>
      </div>
    </>
  );
};

export default Form;
