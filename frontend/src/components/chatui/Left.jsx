import React from 'react'
import Search from './Search'
import Users from './Users'
import Logout from './Logout'

function Left({ onUserSelect }) {
  return (
    <div className='flex flex-col w-full h-full text-gray-300 bg-[#0c0a0a]'>
      <Search />
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto px-0 md:px-2">
          <Users onUserSelect={onUserSelect} />
        </div>
        <div className='sticky bottom-0 z-20 bg-transparent p-2'>
          <Logout />
        </div>
      </div>
    </div>
  )
}

export default Left

