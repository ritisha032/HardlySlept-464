import mongoose from "mongoose";
import mailSender from "../utils/mailSender.js";
import emailVerificationTemplate from "../mail/templates/emailVerificationTemplate.js";


const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
    },
    otp: {
        type:String,
        required:true,
    },
    createdAt: {
        type:Date,
        default:Date.now(),
        expires: 100*60,
    }
});


//a function -> to send emails
async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse = await mailSender(email, "OTP Verification Mail", emailVerificationTemplate(otp));
        console.log("Email sent Successfully: ", mailResponse);
    }
    catch(error) {
        console.log("error occured while sending mails: ", error);
        throw error;
    }
}

OTPSchema.pre("save", async function(next) {
    console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();

    
}) 



export default mongoose.model("OTP", OTPSchema);

