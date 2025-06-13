import React, { useState, useEffect } from 'react'
import useConversation from '../../zustand/useConversation'
import { useSocket } from '../../context/useSocket.jsx';

function Showuser() {
  const { selectedConversation } = useConversation();
  const { onlineUsers, socket } = useSocket();
  const itsOnline = onlineUsers.includes(selectedConversation?._id);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleUserTyping = ({ userId }) => {
      if (userId === selectedConversation?._id) {
        setIsTyping(true);
      }
    };

    const handleUserStoppedTyping = ({ userId }) => {
      if (userId === selectedConversation?._id) {
        setIsTyping(false);
      }
    };

    socket.on('userTyping', handleUserTyping);
    socket.on('userStoppedTyping', handleUserStoppedTyping);

    return () => {
      socket.off('userTyping', handleUserTyping);
      socket.off('userStoppedTyping', handleUserStoppedTyping);
    };
  }, [socket, selectedConversation?._id]);

  return (
    <div className="h-full">
      <div className='flex items-center space-x-2 md:space-x-4 px-3 md:px-6 py-2 md:py-3 hover:bg-slate-600 duration-300 rounded-lg cursor-pointer'>
        <div>
          <div className={`avatar ${itsOnline ? "avatar-online" : ""}`}>
            <div className="w-8 md:w-10 rounded-full">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="user avatar" />
            </div>
          </div>
        </div>
        
        <div className='flex flex-col'>
          <div className="text-sm md:text-base font-medium">
            {selectedConversation && selectedConversation.name ? selectedConversation.name : "User"}
          </div>
          <div className="text-xs md:text-sm text-gray-300">
            {isTyping ? "typing..." : itsOnline ? "online" : "offline"}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Showuser
