import express from "express";
import { signup,login, sendOTP} from "../controllers/authController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";
import { resetPassword, resetPasswordToken } from "../controllers/resetPassword.js";
const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);

//protected routes
router.get("/user-auth",requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
});

// Route for sending OTP to the user's email
router.post("/sendotp", sendOTP)

// Route for Changing the password
router.post("/changepassword", requireSignIn, )

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

export default router;
