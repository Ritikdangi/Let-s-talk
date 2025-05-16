import React from 'react'
import { useState , useEffect} from 'react';
import { IoMdSend } from "react-icons/io";
import useSendMessage from '../../context/useSendMessage';
import useConversation from '../../zustand/useConversation';
function Typesend() {
        const { selectedConversation } = useConversation();
       const { loading, sendMessage } = useSendMessage();
       const [inputmessage, setInputMessage] = useState("");
       const handleSend = async (e) => {
        e.preventDefault();
        if (inputmessage.trim() === "") {
          return;
        }
        if (selectedConversation && selectedConversation._id) {
          await sendMessage(inputmessage);
          setInputMessage("");
        }
    }
  

  return (
    <form onSubmit={handleSend}>
    <div className="h-[6vh]  flex  items-center justify-center gap-3">
      <div className=' '>
      <input type="text" placeholder="Type your message" value={inputmessage} className="input border-0 w-[100vh] bg-slate-800  " onChange={(e)=> setInputMessage(e.target.value)} />
        </div>
      <button  >
      <IoMdSend className='text-4xl'/>
      </button>
    
      </div> 
    </form>

  )
}


export default Typesend
