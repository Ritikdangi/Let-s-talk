import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router';
import { CiLogout } from "react-icons/ci";
import Cookies from 'js-cookie';
import { useAuth } from '../../context/AuthProvider';
function Logout() {
    const Navigate = useNavigate();
    const [authUser, setAuthUser] = useAuth();
     const submitHandler = async()=>{
      await axios.post('http://localhost:4000/api/auth/logout', {}, {
        withCredentials: true
      }).then(()=>{
          localStorage.removeItem("ChatApp");
          Cookies.remove("token");
          setAuthUser(null);
          alert("Logged out successfully");
          Navigate('/login')
         }     
         ).catch((e)=>{
          console.log("error in logged out ", e.message);
         })
     }
  return (
    <div className='max-h-[10vh] flex items-center mt-3 gap-4 ml-5 text-white '>
      <div className=" font-semibold ">
        Logout
      </div>
        <button  onClick={submitHandler}>
        <CiLogout className=" text-3xl"/>
        </button>
      
    </div>
  )
}

export default Logout
