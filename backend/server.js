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
function change() {
  var i = Math.floor(Math.random() * guessWord.length);
  return guessWord[i];
}
//Game Logic
async function startGame(obj) {
  function listener1(data) {
    obj.word = data.word;
    console.log("setting word");
    console.log(data.word);
  }
  for (var i = 0; i < obj.gameData.TotalRounds; i++) {
    console.log("round" + i);
    //giving turns to each player
    for (var j = 0; j < obj.players.length; j++) {
      //setting timer of the round
      obj.gameData.CurrentTime = obj.gameData.TotalTime;
      //if the player is not active, go to next player
      const userturn = obj.players[j].user;
      if (obj.gameData.player_names[userturn].active == false) continue;
      //Give option to drawer to select a word out of the choices within 15 sec
      var option = [];
      option.push(change());
      option.push(change());
      option.push(change());
      obj.players[j].id.emit("send_options", option);
      try {
        console.log("in loop");
        //sconsole.log(obj.gameData.players.length);
        //display the number of words to guess to the guessers
        //send three words to the drawer
        obj.players[j].id.emit("feedback", "Choose word");
        var promise1 = new Promise((resolve, reject) => {
          const timeId = setTimeout(() => {
            listener1({ word: "default" });
            resolve("HI");
          }, 15000);
          obj.players[j].id.on("word_chosen", (data) => {
            listener1(data);
            clearTimeout(timeId);
            resolve();
          });
        });
        await promise1;

        //close the listener for the drawer
        obj.players[j].id.removeAllListeners("word_chosen");
        obj.gameData.hint = obj.word.length;
        io.emit("send_hint", obj.word.length);
        obj.players[j].id.emit("send_hint", obj.word);
      } catch (j) {
        console.log(j);
      }
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
          console.log(obj.gameData.CurrentTime);
          console.log(obj.gameData.CurrentTime <= 0);
        }, 1000);
      });
      await promise2;
      obj.players[j].id.emit("feedback", "Round Over");
    }
  }
  console.log("game over");
  obj.gameData.status = "Finished";
  //1-timer
  //when timer runs out give the next player the turn
}

io.on("connection", (socket) => {
  //creating room public and private
  socket.on("create_room", (data) => {
    const rm = guid(); // make sure guid is unique
    socket.join(rm);
    console.log(data.user);
    room[data.type].push(rm);
    game[rm] = {
      players: [{ user: data.user, id: socket }],
      admin: { user: data.user, id: socket },
      word: "09sdfsvclks2111ik",
      gameData: {
        player_names: {},
        TotalRounds: 3, //
        currentRound: 1,
        TotalTime: 30,//
        CurrentTime: 30,
        drawer: null,
        roomNo: rm,
        hint: "",
        admin_name: data.user,
        status: "Lobby",
        type: data.type,
      },
    };
    game[rm].gameData.player_names[data.user] = { active: true, score: 0 };
    socket.emit("game_data", game[rm].gameData);
    //adding listner to those sockets
    socket.on("start_game", (data) => {
      if (data.room in game) {
        game[data.room].gameData.status = "Running";
        io.to(data.room).emit("game_data", game[data.room].gameData);
        startGame(game[data.room]);
      }
      console.log("started game");
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
      if (data.room in game) {
        const arr = game[data.room].gameData.player_names;
        console.log(arr);
        if (Object.keys(arr).find((ele) => ele == data.user) == undefined) {
          socket.join(data.room);
          game[data.room].players.push({
            user: data.user,
            id: socket,
            active: true,
          });
          game[data.room].gameData.player_names[data.user] = {
            active: true,
            score: false,
          };
          console.log("adding the new player");
          io.to(data.room).emit("game_data", game[data.room].gameData);
        } else {
          socket.emit("no_game", { message: "user is already in the game" });
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
      socket.to(data.room).emit("receive_message", { ...data, check });
      socket.emit("receive_message", { ...data, check });
      console.log(check);
    } else {
      socket.emit("feedback", "Not a Member, please join");
    }
  });

  //canvas
  socket.on("send_data",(data)=>{
    socket.broadcast.emit("receive_data",data);
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
