import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId , ref : 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId , ref : 'User', required: true },
  message: { type: String, required: true },
  // Reactions: array of { userId, reaction } so multiple users can react
  reactions: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      reaction: { type: String, required: true },
    }
  ],
  // Mark if the message was edited
  edited: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Message', MessageSchema);