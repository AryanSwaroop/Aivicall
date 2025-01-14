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
      <div className="flex flex-col items-center justify-center h-screen">
        <form
          className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <label
            htmlFor="fileUpload"
            className="cursor-pointer m-auto bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 transition-all"
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
          <div className="flex mt-5 gap-4 mb-4">
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="FirstName"
              type="text"
              placeholder="First Name"
              onChange={setValue}
            />
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="LastName"
              type="text"
              placeholder="Last Name"
              onChange={setValue}
            />
          </div>
          <input
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="Email"
            type="email"
            placeholder="Email"
            onChange={setValue}
          />
          <input
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="Password"
            type="password"
            placeholder="Password"
            onChange={setValue}
          />
          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            type="submit"
          >
            SignUp
          </button>
        </form>
        <a
          href="/login"
          className="mt-5 text-blue-500 cursor-pointer hover:underline"
        >
          Not New? Login Here
        </a>
      </div>
    </>
  );
};

export default Form;
