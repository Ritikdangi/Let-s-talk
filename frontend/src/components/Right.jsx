import React from 'react'
import User from './User'
import { IoMdSend } from "react-icons/io";
import Messages from './Messages';
function Right() {
  return (
    <div className= 'bg-slate-900 text-white w-[70%] '>
      {/* part 1 */}
     <div className="bg-slate-600  h-[8vh]">
        <User />
     </div>
 {/* part 2 */}
     <div className="h-[calc(94vh-10vh)] text-white font-semibold overflow-y-auto mx-6 mt-2">
   <Messages/>
     </div>
 {/* part 3 */}
     <div className="h-[6vh]  flex  items-center justify-center gap-3">
      <div className=' '>
      <input type="text" placeholder="Type your message" className="input border-0 w-[100vh] bg-slate-800  " />
        </div>
      <button>
      <IoMdSend className='text-4xl'/>
      </button>
    
      </div> 
    </div>
  )
}

export default Right
