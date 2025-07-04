import React, { useEffect  , useState} from 'react'
import useConversation from '../zustand/useConversation';
import axios from 'axios';

function useGetMessage() {
    const [loading, setLoading] = useState(false);
    const {messages, setMessage , selectedConversation} = useConversation();
    const API_URL = import.meta.env.VITE_API_URL;
     
     useEffect(()=>{
        setLoading(true);
       const getMessage = async()=>{
     
        if(selectedConversation && selectedConversation._id){
            try{
                console.log("Fetching messages for:", selectedConversation);
         const res  =  await   axios.get(`${API_URL}/api/message/get/${selectedConversation._id}` , {
            withCredentials: true}
         );
              setMessage(res.data);
            setLoading(false);
            }
            catch(error){
              console.log( " error in getting ,essage from api call ",error)
              setLoading(false);
            }
         }
       }
       getMessage();
     }, [selectedConversation , setMessage])
  return {
       loading, messages

  }
}

export default useGetMessage
