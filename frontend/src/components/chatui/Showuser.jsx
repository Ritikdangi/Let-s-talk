import React from 'react'
import useConversation from '../../zustand/useConversation'
function Showuser() {
  const { selectedConversation } = useConversation();
  return (
    <div>
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
       {selectedConversation && selectedConversation.name ? selectedConversation.name : "User"}
     </div>
      <div>
        typing
      </div>
   </div>
     
    </div>
    </div>
  )
}

export default Showuser
