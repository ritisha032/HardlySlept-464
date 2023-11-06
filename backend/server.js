import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import dbConnect from "./config/database.js";

const app=express();

dotenv.config();

//middleware
app.use(morgan("dev"));
app.use(express.json());

app.get('/',(req,res)=>{
    res.send(`<h1>Welcome to ECommerce App</h1>`);
})

const PORT=process.env.PORT || 5000;



import authRoutes from "./routes/authRoutes.js";
app.use("/api/v1",authRoutes);

app.listen(PORT,()=>{
    console.log(`SERVER RUNNING ON ${PORT}`.bgCyan.white);
})
dbConnect();