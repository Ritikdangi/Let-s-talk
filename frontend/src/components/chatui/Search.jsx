import React from 'react'
import { FaSearch } from "react-icons/fa";

function Search() {
  return (
    <div className='text-white px-3 md:px-6 py-3 md:py-4 min-h-[10vh]'>
      <form action="">
        <div className='flex items-center gap-2'>
          <input 
            type="text" 
            placeholder="Search ..." 
            className="input border-[1px] rounded-lg w-full text-sm md:text-base" 
          />
          <button className='text-xl md:text-3xl p-2 hover:bg-gray-600 rounded-md transition-colors'>
            <FaSearch />
          </button>
        </div>
      </form>
    </div>
  )
}

export default Search
