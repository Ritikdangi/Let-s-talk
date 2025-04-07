import React ,{ useMemo } from 'react'
import { io } from "socket.io-client";
import { Button, Container, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import Left from './components/chatui/Left';
import Right from './components/chatui/Right';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';

function App() {
  // const socket = useMemo(() => io("http://localhost:4000"), []);

  //    const[message , setMessage]=useState("");

  //    useEffect(()=>{
  //          socket.on("connect", ()=>{
  //           console.log("user joined with id ",socket.id);
  //          });

  //          socket.on("welcome",(s)=>{
  //           console.log(s);
  //          });
          

  //     return ()=>{     
  //        socket.disconnect();
  //     }
  //    }, []);
   
  //     // function msghandler(e){
  //     //   e.preventDefault();
  //     // console.log(e.target.value)
  //     //   setMessage(
  //     //    e.target.value
  //     //   );
  //     // }
     
  //    function SubmitHandler(e){
  //     e.preventDefault();
  //     // console.log(message)
  //   socket.emit("message", message);
  //   setMessage("");
  //    }

  return (
      
      //   <Container className='border-4 w-[100vh] p-0  h-[80vh] flex flex-row items-end ' disableGutters >
      // <form className=' flex flex-row justify-end border-amber-300 border-4 w-full m-0 ' onSubmit={SubmitHandler}> 
      // <TextField className="w-full" value ={message} onChange= {e=>{ setMessage(e.target.value );}} >
      //       Enter your message....
      //   </TextField>
      //    <Button variant="outlined"  type="submit">Send</Button>
      // </form>  
      // </Container>
/* <div className='flex h-screen w-screen flex-row'>
    <Left/>
    <Right />
</div> */
    /*  <Signup/> */
   <div className='w-sceeen'>
    <Signup/>
   </div>

  )
}

export default App
