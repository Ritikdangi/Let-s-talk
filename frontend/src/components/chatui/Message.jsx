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
      <div className={`chat ${chatName} w-full`}> 
        {/* Inner wrapper ensures the bubble hugs left/right edges */}
        <div className={itsMe ? 'w-full flex justify-end' : 'w-full flex justify-start'}>
          <div
            className={`chat-bubble rounded-3xl text-white ${chatColor} text-sm md:text-base max-w-[85%] md:max-w-[70%] p-3 inline-block`}
            style={{ overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}
          >
            <div className="flex items-end gap-2">
              <span className="break-words" style={{ overflowWrap: 'break-word' }}>{message.message}</span>
              <span
                className="text-[11px] text-gray-300"
                style={{ opacity: 0.7, whiteSpace: 'nowrap' }}
              >
                {time}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Message;