import { hashPassword } from "../helper/authHelper.js";
import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcrypt";
import mailSender from "../utils/mailSender.js";
import otpGenerator from "otp-generator";
import Profile from "../models/Profile.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Game from "../models/Game.js";
dotenv.config();

export const signup = async (req, res) => {
  try {
    //fetch details from the request body
    const { name, email, username, password, otp } = req.body;
    console.log(name,email,username,password,otp);

    if (!name || !email || !username || !password || !otp ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check if an user already exists with the given credentials
    const existingUserName = await User.findOne({ username });

    if (existingUserName) {
      return res
        .json({
          success: false,
          message: "Username already registered",
        })
        .status(204);
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res
        .json({
          success: false,
          message: "Email id already registered",
        })
        .status(204);
      return res;
    }

    //find most recent OTP stored for the user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
      console.log("email",email);
    console.log("otp= ",recentOtp);
    //validate OTP
    if (recentOtp.length == 0) {
      //OTP not found
      return res.status(400).json({
        success: false,
        message: "OTP not Found",
      });
    } else if (otp !== recentOtp[0].otp) {
      //Invalid OTP
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await hashPassword(password);

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumer: null,
    });

    //create user with the given data
    const user = await new User({
      name,
      email,
      username,
      password: hashedPassword,
      image:`https://api.multiavatar.com/${name}`,
      additionalDetails: profileDetails._id,
    }).save();

    return res
      .json({
        success: true,
        message: "user created successfully",
        user,
      })
      .status(200);
  } catch (err) {
    console.error(err);

    return res
      .json({
        success: false,
        message: "user cannot be registered",
      })
      .status(500);
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email,password);
    if (!email || !password) {
      return res
        .json({
          success: false,
          message: "Invalid credentials",
        })
        .status(400);
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .json({
          success: false,
          message: "Invalid Email",
        })
        .status(400);
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .json({
          success: false,
          message: "Invalid Password",
        })
        .status(200);
    }

    //create a JWT TOKEN

    const payload = {
      id: user._id,
      email:user.email
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    user = user.toObject();

    user.token = token;
    user.password=undefined;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
      message: `User Login Success`,
    });
  } catch (err) {
    console.error(err);

    return res
      .json({
        success: false,
        message: "user cannot be loggedin",
      })
      .status(500);
  }
};

//send OTP function

export const sendOTP = async (req, res) => {
  try {
    //fetch email from request ki body
    const { email } = req.body;
    console.log(email);

    //check if user already exist
    const checkUserPresent = await User.findOne({ email });
    console.log(checkUserPresent);
    ///if user already exist , then return a response
    if (checkUserPresent) {
      return res.json({
        success: false,
        message: "User already registered",
      }).status(401);
    }

    //generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generated: ", otp);

    //check unique otp or not
    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    //create an entry for OTP
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    //return response successful
    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password

		const encryptedPassword = await hashPassword(password);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.name}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};

export const createGame = async (req, res) => {
  try {
    const { date, no_participants, rank, score, no_guesses_made, no_rounds } =
      req.body;
    const userId = req.user.id;
    console.log("user id= ", userId);
    // console.log(req.user.id);
    const game = await new Game({
      date,
      no_participants,
      rank,
      score,
      no_guesses_made,
      no_rounds,
      userId
    }).save();

    const gameId=game.id;

    console.log("game id= ",gameId);

    const user=await User.findById(userId);

    const udpatedUser = await User.findByIdAndUpdate(user, {$push: {gameHistory: gameId} }, {new :true})
    .populate("gameHistory").exec();

    return res.json({
        updatedUser:udpatedUser,
        message:"Game History stored successfully"
    }).status(200);

  } catch (err) {
    console.error(err);

    return res
      .json({
        success: false,
        message: "user cannot be loggedin",
      })
      .status(500);
  }
};
export const getGames=async(req,res)=>{
    try
    {
            const userId=req.user.id;

            console.log("user Id= ",userId);

            const gameObjects=await User.findByIdAndUpdate(userId).populate("gameHistory");

            res.json(gameObjects.gameHistory);

            
    }
    catch(error)
    {
        console.error(error);
    }
}

export const getUser=async(req,res)=>{
  try{
    const userId=req.user.id;

    const user=await User.findById(userId).populate("additionalDetails");

    console.log(user);

    return res.json({
      additionalDetails:user.additionalDetails,
      image:user.image
    }).status(200);

  }
  catch(error)
  {
    console.error(error);
  }
}