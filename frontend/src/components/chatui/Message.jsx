import React from 'react';

const Message = React.forwardRef(({ message }, ref) => {
  const authUser = JSON.parse(localStorage.getItem("ChatApp"));
  const user = authUser?.user?._id; 
  const itsMe = message.senderId === user;
  const chatName = itsMe ? "chat-end" : "chat-start";
  const chatColor = itsMe ? "bg-blue-500" : "";

  // Format the time (hh:mm AM/PM)
  const time = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    : '';

  return (
    <div ref={ref} className="px-2 md:px-4 py-1">
      <div className={`chat ${chatName}`}>
        <div>
          <div className={`chat-bubble rounded-3xl text-white ${chatColor} break-words text-sm md:text-base max-w-[80%] md:max-w-[100%]`}>
            {message.message}
          </div>
          <div
            className="text-[11px] text-gray-400 mt-1"
            style={{
              textAlign: itsMe ? 'right' : 'left',
              marginLeft: itsMe ? 'auto' : '16px',
              marginRight: itsMe ? '16px' : 'auto',
              width: 'fit-content',
              minWidth: 40,
            }}
          >
            {time}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Message;