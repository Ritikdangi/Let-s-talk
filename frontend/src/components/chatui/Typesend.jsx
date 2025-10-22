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
  <form onSubmit={handleSend} className="px-3 md:px-6 py-3 bg-slate-900 border-t border-slate-800 z-30">
      <div className="max-w-full mx-auto flex items-center gap-3">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Type your message"
              value={inputmessage}
              className="w-full bg-slate-800 text-sm md:text-base text-white placeholder-slate-400 rounded-lg px-4 py-2 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => {
                setInputMessage(e.target.value);
                handleTyping();
              }}
              aria-label="Type a message"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <button
                type="submit"
                disabled={!inputmessage.trim() || loading || !selectedConversation}
                className="h-10 w-10 flex items-center justify-center text-blue-400 hover:text-blue-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors"
                aria-label="Send message"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <IoMdSend className='text-base md:text-lg' />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Typesend
