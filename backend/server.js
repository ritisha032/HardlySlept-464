const express =require("express");
const dotenv = require("dotenv");
const morgan =require("morgan")
const dbConnect =require("./config/database.js");

const app=express();

dotenv.config();

//middleware
app.use(morgan("dev"));
app.use(express.json());

app.get('/',(req,res)=>{
    res.send(`<h1>Welcome to ECommerce App</h1>`);
})

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`SERVER RUNNING ON ${PORT}`);
})
dbConnect();