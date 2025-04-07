import React from 'react'
import { FaSearch } from "react-icons/fa";
function Search() {

  return (
    <div className='text-white px-6 py-4 h-[10vh]'>
        <form action="">
        <div className='flex'>
      <input type="text" placeholder="Search ..." className="border-[1px] items-center rounded-lg input gap-2 mr-4 w-[80%] mt-1  " />
        <button className=' text-3xl ml-2 px-2 hover:bg-gray-600 rounded-md' >
        <FaSearch />
        </button>
      </div>
   
        </form>
        </div>
  )
}

export default Search
