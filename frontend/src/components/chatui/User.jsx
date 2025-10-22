import React from 'react'
import useConversation from '../../zustand/useConversation';
import { useSocket } from '../../context/useSocket.jsx';
function User({ userData, onUserSelect }) {
  const { selectedConversation , setSelectedConversation } = useConversation();
  const isSelected = (selectedConversation?._id === userData?._id);
  const {onlineUsers} = useSocket();
  const itsOnline = onlineUsers.includes(userData?._id);
  const last = userData?.lastMessage || 'say "Hi" to start the conversation';

  return (
    <div className={`${isSelected ? 'bg-slate-700' : ''}`} onClick={() => {
      setSelectedConversation(userData);
      if (typeof onUserSelect === 'function') onUserSelect();
    }}>
      <div className='flex space-x-3 px-4 py-2 hover:bg-slate-600 duration-300 rounded-lg cursor-pointer items-center'>
        <div className='flex-shrink-0'>
          <div className={`avatar ${itsOnline ? 'avatar-online' : ''}`}>
            <div className='w-10 rounded-full'>
              <img src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp' alt={userData?.name} />
            </div>
          </div>
        </div>

        <div className='flex-1 min-w-0'>
          <div className='text-sm font-medium truncate'>{userData?.name}</div>
          <div className='text-xs text-gray-300 truncate'>{String(last).slice(0, 40)}</div>
        </div>
      </div>
    </div>
  )
}

export default User
