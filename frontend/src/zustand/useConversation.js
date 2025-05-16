import { create } from 'zustand'

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (conversation) => {
    // console.log("Setting selectedConversation:", conversation); // ✅ Logs before state update
    set({ selectedConversation: conversation });
},
   messages: [],
  setMessage : (messages)=>set( { messages}),
}))

export default useConversation