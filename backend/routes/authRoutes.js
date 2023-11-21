import express from "express";
import { signup,login} from "../controllers/authController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";
const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);

//protected routes
router.get("/user-auth",requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
});



export default router;
