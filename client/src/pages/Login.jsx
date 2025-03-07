import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "../Firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const loginUser = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log(result)
      const authInfo = {
        userId: result.user.uid,
        email: result.user.email,
        isAuth: true,
      };
      localStorage.setItem("authInfo", JSON.stringify(authInfo));
      setSuccess("Login successful!");
      await axios.post("http://localhost:8000/login", "admin", { withCredentials: true });
      navigate("/home"); // Redirect to home page or dashboard after successful login
    } catch (error) {
      setError("Invalid email or password.");
    }
  };

  const handleGoogleSignup = async () => {
        
       try{
        const result = await signInWithPopup(auth, googleProvider);
        const authInfo = {
          userId: result.user.uid,
          email: result.user.email,
          isAuth: true,
        };
        const email = result.user.email;
        const name = result.user.displayName;

    
        localStorage.setItem("authInfo", JSON.stringify(authInfo));
        setSuccess("Login successful!");
        await axios.post("http://localhost:8000/login", { email }, { withCredentials: true });
        navigate("/home");
        
         } catch (error) {
            console.log(error);
            setError("Invalid email or password.");
        }
       
      };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      setSuccess("");
      return;
    }
    setError("");
    loginUser();
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 to-purple-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-black mb-6 text-center">Login</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-md font-medium text-black mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-md font-medium text-black mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition duration-200"
          >
            Login
          </button>
          <button
          onClick={handleGoogleSignup}
          className="mt-3 cursor-pointer relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100"
          type="button"
        >
          
              <span className="mr-2">
                <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6 text-rose-500">
                  <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" />
                </svg>
              </span>
              Sign in with Google
          
        
        </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
