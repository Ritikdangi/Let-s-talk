import React from 'react'
import User from './User'

function Users() {
  return (
    <div className='px-5 py-2 text-white font-semibold '>
        <h1 className='bg-slate-500 p-2 rounded-md'>
        Messages 
        </h1>
       
        <div className=' overflow-y-auto max-h-[calc(88vh-10vh)] scrollbar-hide '>
      <User/>
      <User/>
      <User/>
      <User></User>
      <User></User>
      <User></User>
      <User></User>
      <User></User>
      <User/>
      <User/>
      <User/>
      <User/>
      <User/>
      <User/>
        </div>
    
    </div>
  )
}

export default Users

