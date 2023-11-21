import JWT from "jsonwebtoken";
import User from "../models/User.js";
export const requireSignIn=async(req,res,next)=>{
    try{

        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
          );
        req.user=decode;
        next();

    }catch(error){
        console.error(error);
    }
}