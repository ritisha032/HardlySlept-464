import mongoose from "mongoose";
import Game from "./Game.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      //required: true,
    },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    token :{
      type:String,
  },
  resetPasswordExpires: {
      type:Date,
  },
  gameHistory:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Game",
    }
]


  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);
