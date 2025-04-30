import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  messageId: { type: mongoose.Schema.Types.ObjectId, ref : 'Message'},
  members : [{ type: mongoose.Types.ObjectId, ref : 'User' }],
  messages: [{ type: mongoose.Types.ObjectId, ref : 'Message', default: [] } ],
},{timestamps : true});

export default mongoose.model('Conversation', ConversationSchema);