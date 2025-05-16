import { useEffect ,useState} from 'react';
import React  from 'react'
import useConversation from '../zustand/useConversation';
import axios from 'axios';
function useSendMessage() {
      const [loading, setLoading] = useState(false);
        const {messages, setMessage , selectedConversation} = useConversation();

       
       
       const sendMessage = async(message)=>{
                   setLoading(true);
    
            try{
                console.log("Sending  messages for:", selectedConversation);
         const res  =  await   axios.post(`http://localhost:4000/api/message/send/${selectedConversation._id}` ,{message} ,{
            withCredentials: true}
         );
          console.log(res.data.newMessage);
             setMessage([...messages , res.data.newMessage]);
            setLoading(false);
            }
            catch(error){
              console.log( " error in sendind message from api call ",error)
              setLoading(false);
            }
         
    
     }
         
        
  return {
       loading,  sendMessage
  }
}

export default useSendMessage
