import { hashPassword } from "../helper/authHelper.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signup=async(req,res)=>
{
    try{

        //fetch details from the request body
        const{name,email,username,password,password1}=req.body;
         console.log(name,email,password,username);
       // console.log(name,email,password,password1);

        //check if an user already exists with the given credentials
        const existingUserName=await User.findOne({username})

        if(existingUserName)
        {
            
            return res.json({
        
                success:false,
                message:"Username already registered",
            }).status(204);
            

        }
        const existingUser=await User.findOne({email});

        if(existingUser){
            
            res.json({
                
                success:false,
                message:"Email id already registered",
            }).status(204);
            return res;
        }

        const hashedPassword=await hashPassword(password);

            //create user with the given data
            const user=await new User({
                name,email,username,password:hashedPassword
            }).save();
    
            return res.json({
                success:true,
                message:"user created successfully",
                user
            }).status(200);

    }
    catch(err){
        console.error(err);

        return res.json({
            success:false,
            message:"user cannot be registered",
        }).status(500);
    }
}
export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email || !password){
            return res.json({
                success:false,
                message:"Invalid credentials",
            }).status(400);
        }
        const user=await User.findOne({email});
        if(!user){
            return res.json({
                success:false,
                message:"Invalid Email",
            }).status(400);
        }
        const match=await bcrypt.compare(password,user.password);
        if(!match){
            return res.json({
                success:false,
                message:"Invalid Password",
            }).status(200);
        }

        //create a JWT TOKEN
      
       const payload={
            id:user._id,
       }
        const token=await JWT.sign(payload,process.env.JWT_SECRET,{expiresIn:'1d'});
        
        res.json({
            success:true,
            message:"Logged iN SUCCESSFULLY",
            user:{
                name:user.name,
                email:user.email,
                username:user.username
            },
            token,
            }).status(200);
    }
    
    catch(err){
        console.error(err);

        return res.json({
            success:false,
            message:"user cannot be loggedin",
        }).status(500);
    
}
}

    