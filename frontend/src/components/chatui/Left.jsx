import React from 'react'
import Search from './Search'
import Users from './Users'
import Logout from './Logout'

function Left() {
  return (
    <div className='flex flex-col w-full md:w-[30%] text-gray-300 bg-[#0c0a0a] h-screen'>
      <Search/>
      <div className="flex-1 overflow-y-auto">
        <Users/>
      </div>
      <Logout/>
    </div>
  )
}

export default Left

