import React, { useEffect, useRef } from 'react'
import useGetMessage from '../../context/useGetMessage.jsx'
import Loading from './Loading.jsx';
import Message from './Message.jsx';
import useConversation from '../../zustand/useConversation';
function Messages() {
   const { loading , messages} = useGetMessage();
    const { selectedConversation } = useConversation();

    const lastMsgRef = useRef();
    useEffect(()=>{

            lastMsgRef.current?.scrollIntoView({ behavior: "smooth" });
            console.log("scrolling to last message");

       console.log(lastMsgRef.current  , messages);
    }, [messages]);
  //  console.log(messages);
  return (
    <div className=' h-full w-full overflow-y-auto scrollbar-hide'>

       {/* condition 3 */}
          {
            loading && !selectedConversation && (
              < div className='flex  justify-center items-center h-full '>
               Select a conversation to start chatting
              </div>
            )
          }

         {/* condition 1  */}
         {
          loading ? (<Loading/>  ): ( messages.length>0 && messages.map((message , index)=>{
           return <Message key={message._id } ref= {index==messages.length -1 ? lastMsgRef : null}  message ={ message}/>
          }))
         }

         {/* condtion 2 */}
         {
          !loading && messages.length ===0 && (
            < div className='flex  justify-center items-center h-full '>
              Say! Hi to start the conversation
            </div>
           )
         }
         
    </div>
  )
}

export default Messages
