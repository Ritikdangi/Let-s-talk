import React from 'react'
import { useState , useEffect} from 'react';
import { IoMdSend } from "react-icons/io";
import useSendMessage from '../../context/useSendMessage';
import useConversation from '../../zustand/useConversation';
import { useSocket } from '../../context/useSocket';

function Typesend() {
        const { selectedConversation } = useConversation();
       const { loading, sendMessage } = useSendMessage();
       const [inputmessage, setInputMessage] = useState("");
       const { socket } = useSocket();
       const [isTyping, setIsTyping] = useState(false);
       let typingTimeout;

       const handleTyping = () => {
         if (!selectedConversation?._id) return;
         
         if (!isTyping) {
           setIsTyping(true);
           socket?.emit('typing', { receiverId: selectedConversation._id });
         }
         
         // Clear existing timeout
         clearTimeout(typingTimeout);
         
         // Set new timeout
         typingTimeout = setTimeout(() => {
           setIsTyping(false);
           socket?.emit('stopTyping', { receiverId: selectedConversation._id });
         }, 2000);
       };

       useEffect(() => {
         return () => {
           clearTimeout(typingTimeout);
           if (isTyping) {
             socket?.emit('stopTyping', { receiverId: selectedConversation._id });
           }
         };
       }, [selectedConversation?._id, socket, isTyping]);

       const handleSend = async (e) => {
        e.preventDefault();
        if (inputmessage.trim() === "") {
          return;
        }
        if (selectedConversation && selectedConversation._id) {
          await sendMessage(inputmessage);
          setInputMessage("");
          // Stop typing when message is sent
          setIsTyping(false);
          socket?.emit('stopTyping', { receiverId: selectedConversation._id });
        }
    }
  
  return (
    <form onSubmit={handleSend} className="px-2 md:px-4">
      <div className="h-[6vh] flex items-center justify-center gap-2 md:gap-3">
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Type your message" 
            value={inputmessage} 
            className="input border-0 w-full bg-slate-800 text-sm md:text-base" 
            onChange={(e) => {
              setInputMessage(e.target.value);
              handleTyping();
            }} 
          />
        </div>
        <button className="p-2 hover:bg-slate-700 rounded-full transition-colors">
          <IoMdSend className='text-2xl md:text-4xl'/>
        </button>
      </div> 
    </form>
  )
}

export default Typesend
