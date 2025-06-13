import React from 'react';

const Message = React.forwardRef(({ message }, ref) => {
  const authUser = JSON.parse(localStorage.getItem("ChatApp"));
  const user = authUser?.user?._id; 
  const itsMe = message.senderId === user;
  const chatName = itsMe ? "chat-end" : "chat-start";
  const chatColor = itsMe ? "bg-blue-500" : "";

  return (
    <div ref={ref} className="px-2 md:px-4 py-1">
      <div className={`chat ${chatName}`}>
        <div className={`chat-bubble rounded-3xl text-white ${chatColor} text-sm md:text-base max-w-[80%] md:max-w-[70%] break-words`}>
          {message.message}
        </div>
      </div>
    </div>
  );
});

export default Message;