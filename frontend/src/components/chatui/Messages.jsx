import React, { useEffect, useRef } from 'react'
import useGetMessage from '../../context/useGetMessage.jsx'
import Loading from './Loading.jsx';
import Message from './Message.jsx';
import useConversation from '../../zustand/useConversation';
import useGetSocketMessage from '../../context/useGetSocketMessage.jsx';
function Messages() {
   const { loading , messages} = useGetMessage();
    const { selectedConversation } = useConversation();
               useGetSocketMessage();
    // useGetSocketMessage is used to listen for new messages from the socket
    const lastMsgRef = useRef();
    useEffect(()=>{
            lastMsgRef.current?.scrollIntoView({ behavior: "smooth" });
            // console.log("scrolling to last message");
       // console.log(lastMsgRef.current  , messages);
    }, [messages]);
  //  console.log(messages);
  return (
    // Remove its own overflow; parent `Right` provides the scroll container.
    <div className='w-full px-1 md:px-0 py-2'>
      {/* If no conversation is selected, show only the select message */}
      { !selectedConversation && (
        <div className='flex justify-center items-center h-full min-h-[50vh]'>
          Select a conversation to start chatting
        </div>
      )}
      {/* If conversation is selected, show loading, messages, or empty state */}
      { selectedConversation && (
        <>
          { loading ? (
            <Loading/>
          ) : (
            messages.length > 0 ? (
              messages.map((message, index) => (
                <Message key={message._id} ref={index === messages.length - 1 ? lastMsgRef : null} message={message} />
              ))
            ) : (
              <div className='flex justify-center items-center h-full min-h-[40vh]'>
                Say! Hi to start the conversation
              </div>
            )
          )}
        </>
      )}
    </div>
  )
}

export default Messages
