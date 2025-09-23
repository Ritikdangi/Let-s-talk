import React from 'react'
import Search from './Search'
import Users from './Users'
import Logout from './Logout'

function Left() {
  return (
    <div className='flex flex-col w-full h-screen text-gray-300 overflow-y-auto bg-[#0c0a0a]'>
      <Search/>
      <div className="flex-1 overflow-hidden overflow-y-auto">
        <Users/>
      </div>
      <Logout/>
    </div>
  )
}

export default Left

