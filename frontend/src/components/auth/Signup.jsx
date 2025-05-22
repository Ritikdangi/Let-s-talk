import React from 'react';
import { useForm } from 'react-hook-form';
import { FaRegUser } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { useAuth } from '../../context/useAuth.jsx';
import axios from "axios" ;
import { Link } from 'react-router';
function Signup() {

  // context api state using here
  const [ authUser, setAuthUser] = useAuth();
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();
  
  const onSubmit = async(data) => {
    console.log("Form submitted:", data);
    // Add your signup logic here (e.g., API call)
      const userInfo= {
        name : data.fullname,
        email : data.email,
        password : data.password
      };
      // api req to backend for user register 
    await  axios.post("http://localhost:4000/api/auth/register", userInfo , { withCredentials: true }).then((response)=>{
        console.log(response);
        if(response.data.user){
          alert("User registered successfully");
            // save user data into local storage 
          localStorage.setItem("ChatApp",JSON.stringify(response.data));
          // set user data into centralized auth  state 
         setAuthUser(response.data.user);
          console.log( "registered user data in auth user on reg ",authUser );
        }
      }).catch((e)=>{
        console.log(e.message);
      });
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="w-screen h-screen flex flex-col items-center justify-center"
    >
      <div className="w-[50vh] h-[40vh] bg-slate-800 rounded-3xl p-6">
        {/* Sign Up Heading */}
        <div className="text-3xl text-green-600 text-center mb-6">Sign up</div>

        {/* Form Inputs */}
        <div className="flex flex-col gap-4">
          {/* Username */}
          <label className="flex gap-3 items-center">
            <FaRegUser className="text-2xl"/>
            <input 
              type="text" 
             placeholder="Full Name" 
             className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
            {...register("fullname", { 
            required: "Full name is required",
             pattern: {
            value: /^[A-Za-z]+(?: [A-Za-z]+)*$/,
            message: "Only letters and spaces between names"
           },
           minLength: {
           value: 3,
           message: "Minimum 3 characters"
           },
           maxLength: {
          value: 50,
          message: "Maximum 50 characters"
         },
        validate: (value) => {
          const nameCount = value.trim().split(/\s+/).length;
          if (nameCount < 2) return "Please enter both first and last name";
          return true;
          }
          })}
           />
          </label>
          {errors.fullname && (
            <p className="text-red-500 text-sm -mt-2">{errors.fullname.message}</p>
          )}

          {/* Email */}
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

          {/* Password */}
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

          {/* Sign Up Button */}
          <button 
            type="submit" 
            className="btn bg-green-500 rounded-lg flex flex-row mx-auto"
          >
            Sign up
          </button>

          {/* Login Redirect */}
          <span className='text-md font-semibold'> 
            Have an account? 
            <Link to="/login"
              className='text-blue-600 ml-2 cursor-pointer underline'
            >
              Login
            </Link>
          </span>
        </div>
      </div>
    </form>
  );
}

export default Signup;