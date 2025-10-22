import React, { useEffect } from 'react'
import { useSocket } from './useSocket.jsx';
import useConversation from '../zustand/useConversation.js';

function useGetSocketMessage() {
    const { socket } = useSocket();
    const { setMessage, selectedConversation } = useConversation();

    useEffect(() => {
        if (!socket) {
            console.error('🚨 No socket connection available!');
            return;
        }

        const handleNewMessage = (newMessage) => {
            // Only append messages that belong to the currently selected conversation
            setMessage((prev) => {
                // If no conversation selected, ignore
                if (!selectedConversation) return prev;
                if (String(newMessage.receiverId) === String(selectedConversation._id) || String(newMessage.senderId) === String(selectedConversation._id)) {
                    return [...prev, newMessage];
                }
                return prev;
            });
        };

        const handleEdited = (editedMsg) => {
            setMessage((prev) => prev.map((m) => (String(m._id) === String(editedMsg._id) ? editedMsg : m)));
        };

        const handleReaction = (payload) => {
            // payload expected: { messageId, reactions }
            try { console.debug('socket messageReaction payload', payload); } catch (e) {}
            const { messageId, reactions } = payload || {};
            setMessage((prev) => prev.map((m) => (String(m._id) === String(messageId) ? { ...m, reactions } : m)));
        };

        socket.on('newMessage', handleNewMessage);
        socket.on('messageEdited', handleEdited);
        socket.on('messageReaction', handleReaction);

        return () => {
            socket.off('newMessage', handleNewMessage);
            socket.off('messageEdited', handleEdited);
            socket.off('messageReaction', handleReaction);
        };
    }, [socket, setMessage, selectedConversation]);
}

export default useGetSocketMessage
