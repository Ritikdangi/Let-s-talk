import React, { useEffect } from 'react'
import User from './User'
import { useGetAllUsers } from '../../context/useGetAllUsers';

function Users() {
  const [users , setUsers] = useGetAllUsers();
   console.log("users in users components  " , users);
   if (users === undefined || users === null) {
    return <div className='px-5 py-2  flex justify-center items-center h-[calc(88vh-10vh)] text-white font-semibold'>Loading...</div>
  }
    // console.log(users);
  return (
    <div className='px-5 py-2 text-white font-semibold '>
        <h1 className='bg-slate-500 p-2 rounded-md'>
        Messages 
        </h1>
       
        <div className=' overflow-y-auto h-[calc(88vh-10vh)] scrollbar-hide '>
           {users?.map( (user) => {
               return <User key={user._id} 
                userData={user}  />
           })}
        </div>
    
    </div>
  )
}

export default Users

