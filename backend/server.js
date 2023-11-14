import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/database.js";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";

//<!----for socket.io server----!>
import http from "http";
import {Server} from "socket.io";
//<!----for socket.io server----!>

const app = express();

dotenv.config();

//middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

//<!---------socket related logic -------------------!>//
const publicRooms=[];

const privateRooms=[];

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //console.log(`user connected , ${socket.id}`)

  socket.on("create_pub_room", () => {
    const rm = guid();
    socket.emit("room_code", rm);
    socket.join(rm);
    publicRooms.push(rm);
    // socket.to(rm).emit('joined',{userId:socket.id});

    console.log("room_code", rm);
  });

  socket.on("create_pri_room", () => {
    const rm = guid();
    socket.emit("room_code", rm);
    socket.join(rm);
    privateRooms.push(rm);
    // socket.to(rm).emit('joined',{userId:socket.id});

    console.log("room_code", rm);

});


  
});


//<!---------socket related logic -------------------!>//


//<!------function to generate random no ---------!>//
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
  }
  
  // then to call it, plus stitch in '4' in the third group
  const guid = () => (S4()).toLowerCase();
//<!------function to generate random no ---------!>//

  

app.get("/", (req, res) => {
  res.send(`<h1>Welcome to Scribble Game Backend</h1>`);
});
server.listen(3001, () =>{
    console.log("Our Sockeet io server");
  })
  

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON ${PORT}`);
});
dbConnect();

app.use("/api/v1", authRoutes);
