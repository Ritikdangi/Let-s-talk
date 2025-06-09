import Converastion from "../Models/Converation.js";
import Message from "../Models/Message.js";
import User from "../Models/User.js";
import { getReceiverId  ,io , app} from "../SocketIO/server.js";
export const SendMessage = async(req,res)=>{
       // console.log("message sent")
       try{
            const {message}= req.body;
                  const receiverId = req.params.id;
                  const senderId = req.user.userId;
                  
                 let conversation = await Converastion.findOne({
                     members : {
                         $all : [senderId,receiverId]
                     }
                 });
                 if(!conversation){
                      conversation = await Converastion.create({
                    members : [senderId,receiverId]
                             });  }  


            const newMessage = await Message.create({
                                   senderId,
                                   receiverId,
                                   message
                            });
                       if(newMessage){
           conversation.messages.push(newMessage._id);
           await conversation.save();
                       }

                       const receiverSocketId = getReceiverId(receiverId);
                          if(receiverSocketId){
                             io.to(receiverSocketId).emit("newMessage",newMessage);
                             console.log("message sent to receiver",receiverSocketId);
                          }



                      res.status(200).json({message : "message sent successfully",
                            conversationId : conversation._id,
                            newMessage : newMessage,
                      }); 
       }
       catch(e){
              console.log("error in send message",e);
              res.status(500).json({ message : "internal server error"});
       }
}



export const GetMessage = async(req,res)=>{
     
         try{
        const chatUser = req.params.id ;
        const senderId = req.user.userId;
        let conversation = await Converastion.findOne({
          members : {
              $all : [senderId,chatUser]
          }
      }).populate("messages");
        
      if(!conversation){
         return res.status(200).json([]);
     }  

          const messages = await conversation.messages;
          return res.status(200).json(messages);
}
         catch(error){
              console.log("error in get message" , error);
              res.status(500).json({ message : "internal server error"});
         }
        
}