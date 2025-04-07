import React from 'react'
import { CiLogout } from "react-icons/ci";
function Logout() {
  return (
    <div className='max-h-[10vh] flex items-center mt-3 gap-4 ml-5 text-white '>
      <div className=" font-semibold ">
        Logout
      </div>
        <button>
        <CiLogout className=" text-3xl"/>
        </button>
      
    </div>
  )
}

export default Logout
