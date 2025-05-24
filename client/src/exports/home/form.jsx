import { useState } from "react";
import Navbar from "./navbar";
import API_ENDPOINTS from "../../api/endpoints";
import axiosInstance from "../../api/apiInstance";

const Form = () => {
  const [login, setLogin] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    ProfilePic: "",
  });

  const setValue = (e) => {
    const { name, type, files, value } = e.target;
    setLogin((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const sendSignup = () => {
    const formData = new FormData();
    Object.keys(login).forEach((key) => {
      formData.append(key, login[key]);
    });

    console.log(formData);

    axiosInstance
      .post(API_ENDPOINTS.MANUAL_REGISTER, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log("User registered successfully");
        window.location.href = "/login";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const validateForm = () => {
    const { FirstName, LastName, Email, Password } = login;
    if (!FirstName || !LastName || !Email || !Password) {
      alert("All fields are required");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      sendSignup();
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-purple-950 to-black px-4">
        <form
          className="w-full max-w-lg mx-auto p-6 bg-black/80 border border-purple-700 rounded-xl shadow-[0_0_25px_rgba(128,0,255,0.7)]"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <label
            htmlFor="fileUpload"
            className="block text-center mb-4 bg-purple-600 text-white font-medium py-2 px-4 rounded-md hover:bg-purple-700 transition-all cursor-pointer"
          >
            Upload Profile Picture
          </label>
          <input
            id="fileUpload"
            name="ProfilePic"
            type="file"
            className="hidden"
            onChange={setValue}
          />

          <div className="flex gap-4 mb-4">
            <input
              className="w-full px-4 py-2 bg-black text-purple-100 border border-purple-600 rounded-lg placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              name="FirstName"
              type="text"
              placeholder="First Name"
              onChange={setValue}
            />
            <input
              className="w-full px-4 py-2 bg-black text-purple-100 border border-purple-600 rounded-lg placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              name="LastName"
              type="text"
              placeholder="Last Name"
              onChange={setValue}
            />
          </div>
          <input
            className="w-full px-4 py-2 mb-4 bg-black text-purple-100 border border-purple-600 rounded-lg placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            name="Email"
            type="email"
            placeholder="Email"
            onChange={setValue}
          />
          <input
            className="w-full px-4 py-2 mb-6 bg-black text-purple-100 border border-purple-600 rounded-lg placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            name="Password"
            type="password"
            placeholder="Password"
            onChange={setValue}
          />

          <button
            className="w-full py-3 bg-gradient-to-r from-purple-800 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-900 hover:to-purple-700 transition duration-300 shadow-lg"
            type="submit"
          >
            Sign Up
          </button>
        </form>

        <a
          href="/login"
          className="mt-6 text-purple-400 hover:underline transition"
        >
          Not New? Login Here
        </a>
      </div>
    </>
  );
};

export default Form;
