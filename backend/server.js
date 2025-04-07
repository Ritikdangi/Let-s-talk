import express from "express";
import authRoutes from './Routes/authRoutes.js';
import mongoose from "mongoose";
// import { Server } from "socket.io";
// import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser';
dotenv.config();
const app = express();
const port = 4000;
const URL = process.env.MONGODB_URI;
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'] // Allowed methods
}));
app.use(express.json());
app.use(cookieParser());

// const server = createServer(app);
// const io = new Server(server , {
//      cors :{
//         origin : "http://localhost:5173",
//         methods : ["GET", "POST", "UPDATE", "DELETE"],
//         Credential : true
//      }
// });

// database conneton
mongoose.connect(URL).then(
   console.log("database is connected")
  ).catch((err)=>console.log("error in databse connection", err));

// socket io connection

// io.on("connection", (socket)=>{
//      console.log("user connected ", socket.id);
//     io.emit("welcome","welcome to chat");

//      socket.on("message",(m)=>{
//         console.log(m, socket.id);
//      })
//     socket.on('disconnect', ()=>{
//         console.log("user  desconnected  ", socket.id);
//       })
// });


app.get("/api",(req,res)=>{
    res.send("hello");
});
 // authentication routes
app.use("/api/auth", authRoutes);


app.listen(port, ()=>{
 console.log(`server is running on port ${port}`);
});

