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
          <div
            className={`chat-bubble rounded-3xl text-white ${chatColor} break-words text-sm md:text-base max-w-[80%] md:max-w-[100%] p-3 flex flex-row items-end flex-wrap`}
            style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}
          >
            <span className="break-words" style={{overflowWrap: 'anywhere'}}>{message.message}</span>
            <span
              className={`text-[11px] text-gray-300 ml-2 ${itsMe ? 'self-end' : 'self-end'}`}
              style={{ opacity: 0.7, whiteSpace: 'nowrap' }}
            >
              {time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Message;