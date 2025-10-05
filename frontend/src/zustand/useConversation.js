import { create } from 'zustand'

const getInitialConversation = () => {
  try {
    const raw = localStorage.getItem('lastConversation');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to parse lastConversation from localStorage', e);
    return null;
  }
};

const useConversation = create((set) => ({
  selectedConversation: getInitialConversation(),
  setSelectedConversation: (conversation) => {
    // persist last selected conversation so UI can restore it after refresh
    try {
      if (conversation) {
        localStorage.setItem('lastConversation', JSON.stringify(conversation));
      } else {
        localStorage.removeItem('lastConversation');
      }
    } catch (e) {
      console.error('Failed to persist lastConversation', e);
    }
    set({ selectedConversation: conversation });
  },
  messages: [],
  // allow both direct array and functional updater to avoid stale closures when appending
  setMessage: (messages) => {
    if (typeof messages === 'function') {
      set((state) => ({ messages: messages(state.messages) }));
    } else {
      set({ messages });
    }
  },
}))

export default useConversation