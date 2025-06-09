import {Server} from 'socket.io';
import {createServer} from 'http';
import mongoose from 'mongoose';    
import express from 'express';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const users = {};

 export const getReceiverId=(receiverId)=>{
  return users[receiverId] ;
 }

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  console.log('🔌 New socket connection:', socket.id, 'for user:', userId);

  if (userId) {
    // Store user's socket ID
    users[userId] = socket.id;
    console.log('👥 User connected. Current online users:', Object.keys(users));
    
    // Broadcast updated online users list
    io.emit('getOnlineUsers', Object.keys(users));
  }

  // Handle online users request
  socket.on('requestOnlineUsers', () => {
    console.log('📢 Sending online users list to:', socket.id);
    io.emit('getOnlineUsers', Object.keys(users));
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
    if (userId) {
      delete users[userId];
      console.log('👥 User removed. Current online users:', Object.keys(users));
      io.emit('getOnlineUsers', Object.keys(users));
    }
  });
});

export { app, server, io };