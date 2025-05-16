import React from 'react'
import useConversation from '../../zustand/useConversation';
function User({ userData}) {
  const { selectedConversation , setSelectedConversation } = useConversation();
 const isSelected = (selectedConversation?._id === userData?._id);
  return (
    <div className={` ${isSelected ? 'bg-slate-700' : ''} `} onClick={() => {
      setSelectedConversation(userData); console.log("selectedCONVERSATION in user component " ,selectedConversation) 
      }}>
       <div className={' flex space-x-4 px-6 py-3 hover:bg-slate-600 duration-300 rounded-lg cursor-pointer' } >
   <div >
   <div className="avatar " >
  <div className="w-10 rounded-full">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
  </div>
    </div>

   </div>
   
   <div  className='flex flex-col '>
      <div>
        {userData?.name}
     </div>
      <div>
        {userData?.email}
      </div>
   </div>
     
    </div>
    </div>
   
  )
}

export default User
