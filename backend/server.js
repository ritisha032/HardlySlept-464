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
const room = {private:[],public:[]};
var game={};

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

var guessWord = ["dog","cat","mouse","cow","man","boy","toy","you","team","hulu","fork","lol","polar","angle","eva"];
function change(){
    var i = Math.floor(Math.random()*(guessWord.length));
   return guessWord[i];
}
//Game Logic
async function startGame(obj){

  function listener1(data){
      obj.word=data.word
      console.log("setting word");
      console.log(data.word);
  }
  for(var i=0;i<obj.TotalRounds;i++){
      console.log("round"+i);
      //giving turns to each player
      for(var j=0;j<obj.players.length;j++){
          //setting timer of the round
          obj.CurrentTime=obj.TotalTime;
          //if the player is not active, go to next player
          if(obj.players[j].active==false)continue;
          //Give option to drawer to select a word out of the choices within 15 sec
          var option = [];
          option.push(change());
          option.push(change());
          option.push(change());
          obj.players[j].id.emit("send_options",option);
          try{
            console.log("in loop");
            console.log(obj.players.length);
            //display the number of words to guess to the guessers
            //send three words to the drawer
            obj.players[j].id.emit("feedback","Choose word");
            var promise1 = new Promise((resolve,reject)=>{
             const timeId = setTimeout(()=>{listener1({word:"default"});resolve("HI")},15000);
              obj.players[j].id.on("word_chosen",(data)=>{listener1(data); clearTimeout(timeId);resolve();});

            })
            await promise1
          
            //close the listener for the drawer
            obj.players[j].id.removeAllListeners("word_chosen");  
          }
            catch(j){
              console.log(j)
            }
          //Timer 
          var promise2 = new Promise((resolve,reject)=>{
              var timerDecrease = setInterval(()=>{
                  obj.CurrentTime--;     
                  io.to(obj.roomNo).emit("timer_change",obj.CurrentTime);
                  if(obj.CurrentTime<=0)
                      {
                          clearInterval(timerDecrease);
                          resolve();
                      }
                  console.log(obj.CurrentTime);
                  console.log(obj.CurrentTime<=0)
              },1000); 
          })
          await promise2;
          obj.players[j].id.emit("feedback","Round Over");
          
             
      } 
  }
  console.log("game over");
  obj.status = "Finished";
  //1-timer
  //when timer runs out give the next player the turn
}


io.on("connection", (socket) => {
 
  //creating room public and private
  socket.on("create_room",(data)=>{
    console.log("a1");
    const rm = guid(); // make sure guid is unique
    console.log("a2");
    socket.join(rm);
    console.log(data.user);
    room[data.type].push(rm);
    console.log("a4");
    game[rm]={
              players:[{user:data.user,id:socket,active:true}],
              player_names:[data.user],
              TotalRounds:3,
              currentRound:1,
              TotalTime:30,
              CurrentTime:30,
              drawer:null,
              word:null,
              roomNo:rm,
              admin : {user:data.user,id:socket},
              admin_name : data.user,
              status :"Lobby",
              type : data.type
            };
    console.log("a5");
    console.log(game[rm]);
    const obj={
              player_names : game[rm].player_names,
              TotalRounds : game[rm].TotalRounds,
              currentRound : game[rm].currentRound,
              TotalTime : game[rm].TotalTime,
              CurrentTime : game[rm].CurrentTime,
              drawer : game[rm].drawer,
              word : game[rm].word,
              roomNo : game[rm].roomNo ,
              admin_name : game[rm].admin_name,
              status : game[rm].status,
              type : game[rm].type
    }
    socket.emit("room_created",obj);
    console.log("a6");
    //adding listner to those sockets
    socket.on("start_game",data=>{
      if(data.room in game){
          game[data.room].status = "Running";
          io.to(data.room).emit()
          startGame(game[data.room]);
      }
    })
  })


  socket.on("join_room",(data)=>{
  //data has type of room , username , roomnumber if the room is private
    if(data.room in game){
      socket.join(data.room)
    }

  })
 
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
