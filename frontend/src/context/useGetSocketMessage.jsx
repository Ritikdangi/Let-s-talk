import{ React , useEffect} from 'react'
import { useSocket } from './useSocket.jsx';
import useConversation from '../zustand/useConversation.js';
function useGetSocketMessage() {
    const { socket } = useSocket();
    const {messages, setMessage , selectedConversation} = useConversation();

    useEffect(() => {

          if (!socket) {
    console.error("🚨 No socket connection available!");
    return;
  }

        socket.on("newMessage", (newMessage) => {
            console.log("New message received:", newMessage);
            setMessage([...messages, newMessage]);

            console.log("Current messages:", messages);
        });

        return () => {
            socket.off("newMessage");
        };
    }, [socket, setMessage, messages]);


}

export default useGetSocketMessage
