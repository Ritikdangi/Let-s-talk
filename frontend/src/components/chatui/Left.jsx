import React from 'react'
import Search from './Search'
import Users from './Users'
import Logout from './Logout'

function Left({ onUserSelect }) {
  return (
    <div className='flex flex-col w-full h-full text-gray-300 bg-[#0c0a0a]'>
      <Search/>
      <div className="flex-1 overflow-y-auto">
        <Users onUserSelect={onUserSelect} />
      </div>
      <Logout/>
    </div>
  )
}

export default Left

