import { useEffect ,useState} from 'react';
import React  from 'react'
import useConversation from '../zustand/useConversation';
import axios from 'axios';

function useSendMessage() {
      const [loading, setLoading] = useState(false);
        const {messages, setMessage , selectedConversation} = useConversation();
        const API_URL = import.meta.env.VITE_API_URL;

       
       
    const sendMessage = async (message) => {
      setLoading(true);
      try {
        console.log('Sending messages for:', selectedConversation);
        const res = await axios.post(`${API_URL}/api/message/send/${selectedConversation._id}`, { message }, { withCredentials: true });
        console.log(res.data.newMessage);
        // Use functional updater to avoid stale closures
        setMessage((prev) => [...prev, res.data.newMessage]);
        setLoading(false);
      } catch (error) {
        console.log(' error in sendind message from api call ', error)
        setLoading(false);
      }
    }
         
        
  return {
       loading,  sendMessage
  }
}

export default useSendMessage
