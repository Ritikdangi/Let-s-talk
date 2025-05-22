import React from 'react';
import { useForm } from 'react-hook-form';
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineMail } from "react-icons/ai";
import axios from 'axios';
import { useAuth } from '../../context/useAuth.jsx';
import { Link } from 'react-router';
function Login() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } ,
    reset
  } = useForm();
  
    const [authUser, setAuthUser] = useAuth();
  const onSubmit = async (data) => {
    console.log("Login data:", data);
    //login API call here
      const userInfo= {
            email : data.email,
            password : data.password,
          };
          // api req to backend for user register 
       await axios.post("http://localhost:4000/api/auth/login", userInfo, {
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
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="w-screen h-screen flex flex-col items-center justify-center"
    >
      <div className="w-[50vh] h-[35vh] bg-slate-800 rounded-3xl p-6">
        {/* Login Heading */}
        <div className="text-3xl text-green-600 text-center mb-6">Login</div>

        {/* Form Inputs */}
        <div className="flex flex-col gap-4">
          {/* Email - Same validation as Signup */}
          <label className="flex gap-3 items-center">
                      <AiOutlineMail className="text-2xl" />
                      <input 
                        type="email" 
                        placeholder="mail@site.com" 
                        className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
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
                      <p className="text-red-500 text-sm -mt-2">{errors.email.message}</p>
                    )}
          {/* Password - Same validation as Signup */}
          <label className="flex gap-3 items-center">
            <RiLockPasswordLine className="text-2xl" />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
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
            <p className="text-red-500 text-sm -mt-2">{errors.password.message}</p>
          )}

          {/* Login Button */}
          <button 
            type="submit" 
            className="btn bg-green-500 rounded-lg flex flex-row mx-auto"
          >
            Login
          </button>

          {/* Signup Redirect */}
          <span className='text-md font-semibold'> 
            Don't have an account? 
            <Link  to="/register"
              className='text-blue-600 ml-2 cursor-pointer underline'
            >
              Sign Up
            </Link>
          </span>
        </div>
      </div>
    </form>
  );
}

export default Login;