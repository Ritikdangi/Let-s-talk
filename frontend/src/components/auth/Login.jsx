import React from 'react';
import { useForm } from 'react-hook-form';
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineMail } from "react-icons/ai";
import axios from 'axios';
import { useAuth } from '../../context/useAuth.jsx';
import { Link } from 'react-router';
import Logo from './Logo.jsx';

function Login() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } ,
    reset
  } = useForm();
  
    const [authUser, setAuthUser] = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;
  const onSubmit = async (data) => {
    console.log("Login data:", data);
    //login API call here
      const userInfo= {
            email : data.email,
            password : data.password,
          };
          // api req to backend for user register 
       await axios.post(`${API_URL}/api/auth/login`, userInfo, {
        withCredentials: true // THIS IS CRUCIAL
      }).then((response)=>{
            console.log(response);
            if(!response.data.user){
              alert(response.data.message);
            }
            if(response.data.user){
              alert("User logged in successfully");
              localStorage.setItem("ChatApp", JSON.stringify(response.data));
              setAuthUser(response.data);
              window.dispatchEvent(new Event("storage"));
            }
          
          }).catch((e)=>{
            console.log(e.message);
          });

    // reset();
    
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 p-4">
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto bg-slate-800 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl"
      >
        {/* Let's Talk Logo */}
        <div className="mb-6">
          <Logo size="default" />
        </div>

        {/* Login Heading */}
        <div className="text-xl md:text-2xl text-gray-300 text-center mb-6 font-semibold">Welcome Back!</div>

        {/* Form Inputs */}
        <div className="flex flex-col gap-4">
          {/* Email - Same validation as Signup */}
          <div className="space-y-2">
            <label className="flex gap-3 items-center">
              <AiOutlineMail className="w-6 h-6 text-gray-400 flex-shrink-0" />
              <input 
                type="email" 
                placeholder="mail@site.com" 
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-green-500 focus:outline-none transition-colors"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
            </label>
            {errors.email && (
              <p className="text-red-500 text-sm ml-8">{errors.email.message}</p>
            )}
          </div>

          {/* Password - Same validation as Signup */}
          <div className="space-y-2">
            <label className="flex gap-3 items-center">
              <RiLockPasswordLine className="w-6 h-6 text-gray-400 flex-shrink-0" />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-green-500 focus:outline-none transition-colors"
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters"
                  },
                  pattern: {
                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                    message: "Must include number, lowercase, and uppercase letters"
                  }
                })}
              />
            </label>
            {errors.password && (
              <p className="text-red-500 text-sm ml-8">{errors.password.message}</p>
            )}
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            className="btn bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg flex flex-row mx-auto mt-4 w-full py-3 text-white font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Login
          </button>

          {/* Signup Redirect */}
          <div className="text-center mt-4">
            <span className='text-sm md:text-md font-semibold text-gray-300'> 
              Don't have an account? 
              <Link  to="/register"
                className='text-blue-400 ml-2 cursor-pointer underline hover:text-blue-300 transition-colors'
              >
                Sign Up
              </Link>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;