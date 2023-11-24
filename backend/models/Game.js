import mongoose from 'mongoose';

const gameHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  no_participants: {
    type: Number,
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  no_guesses_made: {
    type: Number,
    required: true,
  },
  no_rounds: {
    type: Number,
    required: true,
  },
  userId:{
    type:String,
    required:true,
  }
});
export default mongoose.model("Game",gameHistorySchema);

