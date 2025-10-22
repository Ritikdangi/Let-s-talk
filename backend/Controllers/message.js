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

// Edit a message (only sender should be allowed)
export const EditMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        const { message: newText } = req.body;
        const userId = req.user.userId;

        const msg = await Message.findById(messageId);
        if (!msg) return res.status(404).json({ message: 'Message not found' });
        if (String(msg.senderId) !== String(userId)) return res.status(403).json({ message: 'Not authorized' });

        msg.message = newText;
        msg.edited = true;
        await msg.save();

        // notify receiver if online
        const receiverSocketId = getReceiverId(msg.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('messageEdited', msg);
        }

        return res.status(200).json({ message: 'Message edited', updated: msg });
    } catch (error) {
        console.error('Error editing message', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// React to a message (add or remove reaction). Expect body: { reaction: '❤️' }
export const ReactMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        const { reaction } = req.body;
        const userId = req.user.userId;

        console.debug('ReactMessage called', { messageId, reaction, userId });
        // log auth info for debugging
        try { console.debug('auth headers', { authorization: req.headers.authorization, cookie: req.headers.cookie, cookies: req.cookies }); } catch (e) {}

        const msg = await Message.findById(messageId);
        if (!msg) {
            console.warn('ReactMessage: message not found for id', messageId);
            return res.status(404).json({ message: 'Message not found' });
        }
        console.debug('ReactMessage: found message, current reactions:', msg.reactions);
        if (!msg) return res.status(404).json({ message: 'Message not found' });

        // Check if user already reacted with same reaction: if so, remove it; otherwise add
        const existingIndex = msg.reactions.findIndex(r => String(r.userId) === String(userId));
        if (existingIndex !== -1) {
            // If same reaction was clicked again -> remove it
            if (msg.reactions[existingIndex].reaction === reaction) {
                msg.reactions.splice(existingIndex, 1);
            } else {
                // Replace previous reaction with the new one
                msg.reactions[existingIndex].reaction = reaction;
            }
        } else {
            // Add new reaction
            msg.reactions.push({ userId, reaction });
        }

        try {
            await msg.save();
            console.debug('ReactMessage saved, reactions now:', msg.reactions);
        } catch (saveErr) {
            console.error('ReactMessage: error saving message', saveErr);
            return res.status(500).json({ message: 'Error saving reaction', error: String(saveErr) });
        }

        // Notify receiver
        const receiverSocketId = getReceiverId(msg.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('messageReaction', { messageId: msg._id, reactions: msg.reactions });
        }
        // Also emit to sender if online (in case both users are in different sockets)
        const senderSocketId = getReceiverId(msg.senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit('messageReaction', { messageId: msg._id, reactions: msg.reactions });
        }

        // Fallback: broadcast to all (safe)
        io.emit('messageReaction', { messageId: msg._id, reactions: msg.reactions });

        return res.status(200).json({ message: 'Reaction updated', reactions: msg.reactions });
    } catch (error) {
        console.error('Error reacting to message', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};