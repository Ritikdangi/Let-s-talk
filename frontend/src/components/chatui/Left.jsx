
import React from 'react'
import Search from './Search'
import Users from './Users'
import Logout from './Logout'
function Left() {
  return (
    <div className='flex flex-col w-[30%] text-gray-300 bg-[#0c0a0a]'>
      <Search></Search>
      <Users></Users>
      <Logout/>
    </div>
  )
}

export default Left

