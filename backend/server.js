import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/database.js";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";


const app=express();

dotenv.config();

//middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send(`<h1>Welcome to ECommerce App</h1>`);
})

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`SERVER RUNNING ON ${PORT}`);
})
dbConnect();

app.use("/api/v1",authRoutes);
