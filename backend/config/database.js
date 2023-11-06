const mongoose =require("mongoose");
const dotenv =require("dotenv");
dotenv.config();

const dbConnect = async () => {
  mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("database connected successfully");
    })
    .catch((error) => {
      console.log("connection failed");
      console.log(error.message);
      process.exit(1);
    });
};
module.exports=dbConnect;