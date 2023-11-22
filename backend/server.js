import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/database.js";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";

//<!----for socket.io server----!>
import http from "http";
import { Server } from "socket.io";
import { isObjectIdOrHexString } from "mongoose";
//<!----for socket.io server----!>

const app = express();

dotenv.config();

//middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

//<!---------socket related logic -------------------!>//
const room = { private: [], public: [] };
var game = {};

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `http://localhost:3000`,
    methods: ["GET", "POST"],
  },
});

var guessWord = [
  "dog",
  "cat",
  "mouse",
  "cow",
  "man",
  "boy",
  "toy",
  "you",
  "team",
  "hulu",
  "fork",
  "lol",
  "polar",
  "angle",
  "eva",
];
function randomWord() {
  var i = Math.floor(Math.random() * guessWord.length);
  return guessWord[i];
}
//Game Logic
async function startGame(obj) {

  //functions Section
  //--------------------------------
  function emitPhaseChange(phase){
    obj.gameData.phase=phase;
    io.to(obj.gameData.roomNo).emit("phase_change",obj.gameData.phase);
  }

  function emitDrawerChange(){
    //seding information to everyone that choosing is taking place
    obj.players[j].id.to(obj.gameData.roomNo).emit("drawer_change",{drawer:obj.gameData.drawer});
    obj.players[j].id.emit("drawer_change",{drawer:obj.gameData.drawer,options:options});
  }

  function addThreeWords(options){
      options.push(randomWord());
      options.push(randomWord());
      options.push(randomWord());
  }

  function emitHint(){
      obj.players[j].id.to(obj.gameData.roomNo).emit("send_hint", obj.gameData.hint);
      obj.players[j].id.emit("send_hint", obj.word);
  }

  function emitScore(){
    io.to(obj.gameData.roomNo).emit("score",scoreData);
  }

  //---------------------------------

  //looping through rounds
  for (var i = 0; i < obj.gameData.TotalRounds; i++) {
    console.log("round" + (i+1));
    //giving turns to each player
  LabelIterator :for (var j = 0; j < obj.players.length; j++) {
      //setting timer of the round
      obj.gameData.CurrentTime = obj.gameData.TotalTime;
      var t=15;

      //if the player is not active, go to next player
      //getting username of the player
      if (obj.players[j].active == false) continue; // seeing if the player is active

      //setting drawer in the game object after checking if he/she is active
      obj.gameData.drawer=obj.players[j].user;
      console.log(obj.gameData.drawer)
      var scoreData = {}; //keep track of score of players
      const Listener1 =  ()=>{
        console.log("disconnect inside game loop")
        emitPhaseChange("score");
        obj.gameData.CurrentTime=0;
        t=0;
      }
      //attaching listener to see if the drawer leaves 
      obj.players[j].id.on("disconnect",Listener1);

      //create an options array to pass to the drawer to choose from
      var options = [];
      addThreeWords(options);
      
      // phase change to choosing
      
      emitPhaseChange("choosing");
      emitDrawerChange();
      

      //Give option to drawer to select a word out of the choices within 15 sec
      try {
        var promise1 = new Promise((resolve, reject) => {
          
          //timeout of 15 seconds
          
          const intervalId = setInterval(()=>{
            obj.players[j].id.emit("timer_change",t);
            t--;
            if(t<=0){
              clearTimeout(timeId); //clearing the above timeout
              clearInterval(intervalId);
              resolve();
            }
          },1000);

          const timeId = setTimeout(() => {
            obj.word = options[Math.floor(Math.random() * 3)] // assigning a random word after time is up
            clearInterval(intervalId);
            resolve();
          }, 15000);
          
          //listener for event word_chosen
          obj.players[j].id.on("word_chosen", (data) => {
            obj.word = data.word;
            clearTimeout(timeId); //clearing the above timeout
            clearInterval(intervalId);
            resolve(); //resolving promise
          });
        });
        await promise1; // blocking further execution until word selection
       
        //close the listener for the drawer
        obj.players[j].id.removeAllListeners("word_chosen");
        console.log("at remove word chosen listener");
        obj.gameData.hint = obj.word.length;
        emitHint();
        
      } 
      catch (j) {
        console.log(j);
      }

      emitPhaseChange("drawing")
      
      obj.players[j].id.on('send_data', (data)=>{
        console.log(data);
        obj.players[j].id.to(data.room).emit("receive_data",data);
        })

      //Timer
      var promise2 = new Promise((resolve, reject) => {
        var timerDecrease = setInterval(() => {
          obj.gameData.CurrentTime--;
          io.to(obj.gameData.roomNo).emit(
            "timer_change",
            obj.gameData.CurrentTime
          );
          if (obj.gameData.CurrentTime <= 0) {
            clearInterval(timerDecrease);
            resolve();
          }
          // if(scoreData.length==obj.players.length-1){
          //   clearInterval(timerDecrease);
          //   resolve();
          // }
          console.log(obj.gameData.CurrentTime);
        }, 1000);
      });
      await promise2;

      emitPhaseChange("score");
      obj.players[j].id.off("disconnect",Listener1);
      // emitScore();
    }
  }
  console.log("game over");
  obj.gameData.status = "Finished";
  emitPhaseChange("finished");
  //1-timer
  //when timer runs out give the next player the turn
}

io.on("connection", (socket) => {
  //creatin room public and private
  socket.on("create_room", (data) => {
    const rm = guid(); // make sure guid is unique
    socket.join(rm);
    console.log(data.user);
    room[data.type].push(rm);
    game[rm] = {
      players: [{ user: data.user, id: socket ,active:true}],
      admin: { user: data.user, id: socket },
      word: "09sdfsvclks2111ik",
      gameData: {
        player_names: {},
        activePlayers:1,
        TotalRounds: 3,
        currentRound: 1,
        TotalTime: 30,
        CurrentTime: 30,
        drawer: null,
        roomNo: rm,
        hint: "",
        admin_name: data.user,
        status: "Lobby",
        phase:null,
        type: data.type,
      },
    };

    game[rm].gameData.player_names[data.user] = { active: true, score: 0 };
    socket.emit("game_data", game[rm].gameData); //emitting game data to move to lobby
    //adding listner to those sockets
    socket.on("start_game", () => {
        if(game[rm].players.length==1)
        socket.emit("no_game", { message: "Get more Players to start the game" });
      else{
          game[rm].gameData.status = "Running";
          io.to(rm).emit("game_data", game[rm].gameData);
          setTimeout(()=>{startGame(game[rm]);},1000);
          console.log("started game");
      }
      //socketDisconnect(socket,game[rm],data);
     
        
    });
    socket.on("disconnect",()=>{
      console.log("disconnect fired");
      const index = game[rm].players.findIndex((ele)=>{return ele.user==data.user;});
      game[rm].players[index].active = false;
      game[rm].gameData.player_names[data.user].active=false;
      io.to(rm).emit("game_data", game[rm].gameData);
      console.log("end of custom disconnection");
    });

    console.log(game[rm]);
  });

  //join a room
  socket.on("join_room", (data) => {
    //data has type of room , username , roomnumber if the room is private
    if (data.type == "public") {
      if (room["public"].length == 0) {
        socket.emit("no_game", { message: "No Public room available to join" });
      } else {
        //randomly assign a game to the socket
      }
    } else {
      if(data.room in game){
        const playerNameObject = game[data.room].gameData.player_names;
        const playerArray = game[data.room].players
        console.log(playerNameObject);
        console.log(playerArray);
        if(playerNameObject[data.user]==undefined || playerNameObject[data.user].active==false) {
          socket.join(data.room);
          playerArray.push({
            user: data.user,
            id: socket,
            active:true
          });
          if(data.user in playerNameObject){
            playerNameObject[data.user].active = true;
          }
          else{
            playerNameObject[data.user] = {
              active: true,
              score: 0,
            };
          }
          console.log("adding the new player");
          console.log(playerNameObject);
          io.to(data.room).emit("game_data", game[data.room].gameData);

          socket.on("disconnect",()=>{
            console.log("disconnect fired");
            const index = playerArray.findIndex((ele)=>{return ele.user==data.user;});
            playerArray[index].active = false;
            playerNameObject[data.user].active=false;
            io.to(data.room).emit("game_data", game[data.room].gameData);
          });
        }
        else{
          //joining an already joined game
          socket.emit("no_game", { message: "Already in the game " });
        }
        
      } else {
        socket.emit("no_game", { message: "No room with this code" });
      }
    }
 
  });

  //send message to everyone in the channel
  socket.on("send_message", (data) => {
    var check = 0;
    if (
      data.room in game &&
      undefined !=
        game[data.room].players.find((ele) => {
          return ele.user == data.user;
        })
    ) {
      console.log(data.message + "==" + game[data.room].word);
      if (data.message.toLowerCase() === game[data.room].word.toLowerCase())
        check = 1;
        //scoreData[data.user]=150;
      socket.to(data.room).emit("receive_message", { ...data, check });
      socket.emit("receive_message", { ...data, check });
      console.log(check);
    } else {
      socket.emit("feedback", "Not a Member, please join");
    }
  });

  socket.on("leave_room",(data)=>{
    socket.leave(data.room);
  })

  socket.on("disconnect",()=>{
    console.log("disconnect was called");
  })
  
  
});

//<!---------socket related logic -------------------!>//

//<!------function to generate random no ---------!>//
function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// then to call it, plus stitch in '4' in the third group
const guid = () => S4().toLowerCase();
//<!------function to generate random no ---------!>//

app.get("/", (req, res) => {
  res.send(`<h1>Welcome to Scribble Game Backend</h1>`);
});
server.listen(process.env.Socket, () => {
  console.log("Our Sockeet io server");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON ${PORT}`);
});
dbConnect();

app.use("/api/v1", authRoutes);
