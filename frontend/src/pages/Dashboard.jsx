import React, { useState } from 'react'
import Left from '../components/chatui/Left'
import Right from '../components/chatui/Right'
import { IoMenu } from "react-icons/io5";

function Dashboard() {
  const [showSidebar, setShowSidebar] = useState(false);
     
  return (
    <div className='flex h-screen w-screen'>
      {/* Mobile Menu Button fixed in the app header (right side) */}
      <button
        className='md:hidden fixed top-4 right-4 z-50 p-2 bg-slate-700 rounded-lg text-white hover:bg-slate-600 transition-colors'
        onClick={() => setShowSidebar(!showSidebar)}
        aria-label="Open menu"
      >
        <IoMenu size={22} />
      </button>
      {/* Sidebar - Hidden on mobile by default, shown when menu is clicked */}
      <div className={`
        fixed md:static w-[280px] max-w-[90vw] md:w-[30%] h-full z-40
        transform transition-transform duration-300 ease-in-out
        ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
  <Left onUserSelect={() => setShowSidebar(false)} />
      </div>

      {/* Main Chat Area */}
      <div className='w-full md:w-[70%] h-full'>
        <Right />
      </div>

      {/* Overlay for mobile - closes sidebar when clicked */}
      {showSidebar && (
        <div 
          className='fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden'
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  )
}

export default Dashboard
