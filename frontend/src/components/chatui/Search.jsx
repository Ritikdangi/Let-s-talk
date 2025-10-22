import React from 'react'
import { FaSearch } from "react-icons/fa";
import { useSearch } from '../../context/SearchContext';

function Search() {
  const { searchQuery, setSearchQuery } = useSearch();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className='text-white px-3 md:px-6 py-4 md:py-4 min-h-[10vh]'>
      <form onSubmit={handleSubmit}>
        <div className='flex items-center gap-2'>
          <input 
            type="text" 
            placeholder="Search ..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input border-[1px] rounded-lg w-full text-sm md:text-base" 
          />
        </div>
      </form>
    </div>
  )
}

export default Search
