import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useAddInfo } from "../hooks/useAddInfo";
import { getUserInfo } from "../hooks/getUserInfo";
import axios from "axios";


const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",

  });

  const { isAuth } = getUserInfo();
  const { addUser } = useAddInfo();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  const createUser = async () => {
    try {
      // Create a new user with Firebase
      const result = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
     
      // Save user data to Firestore
      const authInfo = {
        userId: result.user.uid,
        name: formData.name,
        email: result.user.email,
        isAuth: true,
      };

      console.log(authInfo)

      await axios.post("http://localhost:8000/login", { email: result.user.email }, { withCredentials: true });

      addUser({
        name: formData.name,
        email: result.user.email,
        userId: result.user.uid,
        role: "user",
      });

      localStorage.setItem("authInfo", JSON.stringify(authInfo));
      setSuccess("Signup successful!");
      navigate("/");
    } catch (error) {
      console.log(error);
      setError("Error creating account. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password 
    ) {
      setError("Please fill in all fields.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("Signing in to your account.");
    createUser();
  };

  useEffect(()=>{
    if(isAuth)
    {
        navigate("/")
    }
  })


  return (
    <div className="w-full h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Dark green to dark gray gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900 to-gray-900 opacity-30 blur-2xl animate-pulse"></div>
      
      {/* Glassmorphism container */}
      <div className="bg-white/5 p-8 rounded-lg shadow-lg w-full max-w-md relative backdrop-blur-md border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Signup</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900/80 text-white border border-gray-700 rounded focus:ring-2 focus:ring-green-500 pr-10"
              placeholder="Name"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>

          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900/80 text-white border border-gray-700 rounded focus:ring-2 focus:ring-green-500 pr-10"
              placeholder="Email"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900/80 text-white border border-gray-700 rounded focus:ring-2 focus:ring-green-500 pr-10"
              placeholder="Password"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-800 text-white py-3 rounded hover:bg-green-700 transition"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;