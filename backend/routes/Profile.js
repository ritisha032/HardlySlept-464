import express from "express";
const router = express.Router()
import { requireSignIn } from "../middleware/authMiddleware.js";
import {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  
} from "../controllers/Profile.js"

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", requireSignIn, deleteAccount)
router.put("/updateProfile", requireSignIn, updateProfile)
router.get("/getUserDetails", requireSignIn, getAllUserDetails)

router.put("/updateDisplayPicture", requireSignIn, updateDisplayPicture)

export default router;