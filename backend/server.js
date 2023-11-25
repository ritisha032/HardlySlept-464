import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/database.js";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";


//<!----for socket.io server----!>
import http from "http";
import { Server } from "socket.io";
import { isObjectIdOrHexString } from "mongoose";
import Profile from "./routes/Profile.js";
import {cloud }  from "./config/cloud.js";
import fileUpload from "express-fileupload";


//<!----for socket.io server----!>

const app = express();

dotenv.config();

//middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use(cors());

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
//cloudinary connection
cloud();


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
  "Apple",
  "Cat",
  "Tree",
  "House",
  "Sun",
  "Flower",
  "Smile",
  "Car",
  "Book",
  "Clock",
  "Star",
  "Cake",
  "Hat",
  "Fish",
  "Chair",
  "Moon",
  "Boat",
  "Duck",
  "Robot",
  "Key",
  "Ball",
  "Bird",
  "Cloud",
  "Turtle",
  "Plane",
  "Banana",
  "Spider",
  "Mountain",
  "Snail",
  "Chair",
  "Snake",
  "Ice cream",
  "Rabbit",
  "Sunflower",
  "Ship",
  "Pizza",
  "Butterfly",
  "Treehouse",
  "Bee",
  "Truck",
  "Guitar",
  "Dolphin",
  "Elephant",
  "Rocket",
  "Penguin",
  "Candy",
  "Rocket",
  "Rainbow",
  "Palm tree",
  "Cookie",
  "Cupcake",
  "Robot",
  "Cactus",
  "Umbrella",
  "Spider web",
  "Ant",
  "Watermelon",
  "Television",
  "Teddy bear",
  "Dragonfly",
  "Helicopter",
  "Snowman",
  "Ghost",
  "Spider",
  "Lighthouse",
  "Balloon",
  "Donut",
  "Owl",
  "Beehive",
  "Rocket ship",
  "Fishbowl",
  "Pineapple",
  "Sunglasses",
  "Waterfall",
  "Bicycle",
  "Bat",
  "Lemon",
  "Horse",
  "Ice cream cone",
  "Rainbow",
  "Palm tree",
  "Flower pot",
  "Kangaroo",
  "Lion",
  "Elephant",
  "Giraffe",
  "Penguin",
  "Kangaroo",
  "Jellyfish",
  "Koala",
  "UFO",
  "Watering can",
  "Lobster",
  "Octopus",
  "Robot",
  "Hamburger",
  "Rocket",
  "Soccer ball",
  "Helicopter",
  "Submarine"
];

var scoreData={};
function randomWord() {
  var i = Math.floor(Math.random() * guessWord.length);
  return guessWord[i];
}
function calculateScore(total,spent){
    return Math.max(50,Math.floor((spent/total)*150));
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
    io.to(obj.gameData.roomNo).emit("game_data",obj.gameData);
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
    io.to(obj.gameData.roomNo).emit("score",obj.gameData.player_names);
  }

  //---------------------------------

  //looping through rounds
  for (var i = 0; i < obj.gameData.TotalRounds; i++) {
    console.log("round" + (i+1));
    //giving turns to each player
  LabelIterator :for (var j = 0; j < obj.players.length; j++) {
      //setting timer of the round
      obj.gameData.CurrentTime = obj.gameData.TotalTime;
      obj.gameData.waitTimeRemain = obj.gameData.waitTimeTotal;
      
      //if the player is not active, go to next player
      //getting username of the player
      if (obj.players[j].active == false) continue; // seeing if the player is active

      //setting drawer in the game object after checking if he/she is active
      obj.gameData.drawer=obj.players[j].user;
      console.log(obj.gameData.drawer)

      const DisconnectListener =  ()=>{
        console.log("disconnect inside game loop")
        emitPhaseChange("score");
        obj.gameData.CurrentTime=0;
        obj.gameData.waitTimeRemain=0;
      }
      const CanvasListener = (data) =>{
        obj.players[j].id.to(obj.gameData.roomNo).emit("receive_canvas_data",data);
      }
      obj.players[j].id.on("send_canvas_data",CanvasListener);
      //attaching listener to see if the drawer leaves 
      obj.players[j].id.on("disconnect", DisconnectListener);

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
            obj.players[j].id.emit("timer_change",obj.gameData.waitTimeRemain);
            obj.gameData.waitTimeRemain--;
            if(obj.gameData.waitTimeRemain<=0){
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
      obj.players[j].id.off("disconnect", DisconnectListener);
      obj.players[j].id.off("send_canvas_data",CanvasListener);
      Object.keys(obj.gameData.player_names).map((data,index)=>{
        obj.gameData.player_names[data].score+=obj.gameData.player_names[data].roundScore;
        
      })
      emitScore();
      Object.keys(obj.gameData.player_names).map((data,index)=>{
        obj.gameData.player_names[data].roundScore=0;
      })
    }
  }
  console.log("game over");
  obj.gameData.status = "Finished";
  emitPhaseChange("finished");
  endGameEmit(obj.gameData.roomNo);

}

function endGameEmit(room){
    //remove everyone from the room
    // io.sockets.adapter.rooms[room].forEach(function(s){
    //   s.leave(room);
    // });
    //remove the room from game array
    game[room].players.map((data)=>{
      data.id.emit("no_game","game ended");
      data.id.leave(room);
    })
  
    delete game[room];
}

function startGameSocket(gameObj,room,userSocket){
  userSocket.on("start_game", () => {
    if(gameObj.gameData.activePlayers==1)
    userSocket.emit("no_game", { message: "Get more Players to start the game" });
  else{
      gameObj.gameData.status = "Running";
      io.to(room).emit("game_data", gameObj.gameData);
      try{
        setTimeout(()=>{startGame(gameObj);},1000);
      }
      catch(e){
        console.log(e);
      }
      console.log("started game");
  }
  //adding disconnect listener  
});
}

function addLobbySocket(userSocket,room){
  userSocket.on("lobby_round_emit",(data)=>{
    game[room].gameData.TotalRounds=data;
    userSocket.to(room).emit("lobby_round_emit",data)
 }) 
 userSocket.on("lobby_duration_emit",(data)=>{
    game[room].gameData.TotalTime=data;
    userSocket.to(room).emit("lobby_duration_emit",data);
 })
}

function disconnectSocket(gameObj,room,user,userSocket){
  userSocket.on("disconnect",()=>{
    console.log("disconnect fired");
    const index = gameObj.players.findIndex((ele)=>{return ele.user==user;});
    gameObj.players[index].active = false;
    gameObj.gameData.activePlayers--;
    gameObj.gameData.player_names[user].active=false;
    io.to(room).emit("game_data", gameObj.gameData);
    console.log("end of custom disconnection");

    if(gameObj.gameData.admin_name==user){
      console.log("changing admin");
      if(gameObj.gameData.status=="Lobby"){
        //if there are at least one player
        console.log("lobby admin change");
        adminChange(gameObj,room,1);
      }
      else if(gameObj.gameData.status=="Running"){
        adminChange(gameObj,room,2);
      }
    }
   
    
  });
}

function adminChange(gameObj,room,minActivePlayer){
  if(gameObj.gameData.activePlayers>=minActivePlayer){
    //give the power to next player
    console.log("admin change more than min active player")
    const player_namesArray = Object.keys(gameObj.gameData.player_names);
    const foundActive = player_namesArray.find((ele) => gameObj.gameData.player_names[ele].active == true);
    const playersArray = gameObj.players;
    const nextAdmin = playersArray.find((ele)=> ele.user==foundActive);
    console.log(nextAdmin);
    gameObj.admin.user = nextAdmin.user;
    gameObj.admin.id = nextAdmin.id;
    gameObj.gameData.admin_name = nextAdmin.user;
    startGameSocket(gameObj,room,gameObj.admin.id);
    addLobbySocket(gameObj.admin.id,room);
    addKickMuteSocket(gameObj,room,gameObj.admin.id)
    io.to(room).emit("game_data",game[room].gameData);
  }
  else{
    //game end and remove
    console.log("admin change less than min active player")
    gameObj.gameData.CurrentTime=0;
    gameObj.gameData.TotalTime=0;
    gameObj.gameData.waitTimeRemain=0;
    gameObj.gameData.waitTimeTotal=0;

}
}
function replaceWordsWithAsterisks(inputString) {
  // Create a regular expression pattern with the words joined by '|'
  const words = ['fuck', 'dick', 'asshole','bitch','bastard','bloody']
  const pattern = new RegExp(words.join('|'), 'gi');
   var check;
  // Replace each match with asterisks of the same length
  const resultString = inputString.replace(pattern, match => '*'.repeat(match.length));

  if(resultString!=inputString)
    	check=2
	else
    	check=0
  return {
  	updated:resultString,
    check
  }
}

function addKickMuteSocket(gameObj,room,userSocket){
  userSocket.on("kick",(data)=>{
    gameObj.players.map((ele)=>{
        if(ele.user==data) ele.id.emit("kicked");
    })
  })
  userSocket.on("mute",(data)=>{
      gameObj.muteList.push(data);
      console.log("added into mute list");
      console.log(gameObj.muteList);
  })
}

// Example usage:




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
      muteList:[],
      gameData: {
        player_names: {},
        activePlayers:1,
        TotalRounds: 3,
        currentRound: 1,
        TotalTime: 30,
        CurrentTime: 30,
        waitTimeTotal: 15,
        waitTimeRemain : 15,
        drawer: null,
        roomNo: rm,
        hint: "",
        admin_name: data.user,
        status: "Lobby",
        phase:null,
        type: data.type,
      },
    };

    game[rm].gameData.player_names[data.user] = { active: true, score: 0, roundScore:0, restrict_count:0, mute:false };
    socket.emit("game_data", game[rm].gameData); //emitting game data to move to lobby
    //adding listner to those sockets
    startGameSocket(game[rm],rm,socket);
    addKickMuteSocket(game[rm],rm,socket);
  
    addLobbySocket(socket,rm); 
    disconnectSocket(game[rm],rm,data.user,socket);
    //console.log(game[rm]);

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
        console.log(game[data.room]);
        game[data.room].gameData.activePlayers++;
        if(playerNameObject[data.user]==undefined || playerNameObject[data.user].active==false) {
          socket.join(data.room);
          
          if(data.user in playerNameObject){
            playerNameObject[data.user].active = true;
            playerArray.map((ele)=> {if(ele.user==data.user){ele.active=true; ele.id=socket}});
          }
          else{
            playerNameObject[data.user] = {
              active: true,
              score: 0,
              roundScore:0,
              restrict_count:0,
              mute:false 
            };
            playerArray.push({
              user: data.user,
              id: socket,
              active:true,
            });
          }
          console.log("adding the new player");
          console.log(playerNameObject);
          io.to(data.room).emit("game_data", game[data.room].gameData);
          //attaching disconnect socket listener
          disconnectSocket(game[data.room],data.room,data.user,socket);
        }
        else{
          //joining an already joined game
          socket.emit("no_game", { message: "Already in the game " });
        }
        
      } else {
        socket.emit("no_game", { message: "No room with this code" });
        console.log("fired no_game no room with this code" + data.room)
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
      if (data.message.toLowerCase() === game[data.room].word.toLowerCase()){
        check = 1;
        game[data.room].gameData.player_names[data.user].roundScore = Math.max(calculateScore(game[data.room].gameData.TotalTime,game[data.room].gameData.CurrentTime),game[data.room].gameData.player_names[data.user].roundScore);
        game[data.room].gameData.player_names[game[data.room].gameData.drawer].roundScore+=game[data.room].gameData.player_names[data.user].roundScore;
      }
      if(replaceWordsWithAsterisks(data.message).check==2){
        check=2;
        game[data.room].gameData.player_names[data.user].restrict_count++;
        if(game[data.room].gameData.player_names[data.user].restrict_count>3){
          //kick the user;
          socket.emit("kicked");
          console.log("hum hain kicked hone waale");
        }
        else{
          var warning = "Don't Abuse, You'll get restricted"
          var safeMessage = replaceWordsWithAsterisks(data.message).updated;
          socket.emit("receive_message",{message:warning,room:data.room,user:"game police",check:2});
          socket.emit("receive_message",{message:safeMessage,room:data.room,user:data.user,check:2});
          if(!(game[data.room].muteList.includes(data.user))){
            socket.to(data.room).emit("receive_message",{message:warning,room:data.room,user:"game police",check:2});
            socket.to(data.room).emit("receive_message",{message:safeMessage,room:data.room,user:data.user,check:2});
          }
         
        }
      }
      else{
        if(!(game[data.room].muteList.includes(data.user))){
          socket.to(data.room).emit("receive_message", { ...data, check });
        }
        
        socket.emit("receive_message", { ...data, check });
        console.log(check);

      }
      
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

app.use("/api/v1", authRoutes);
app.use("/api/v1/profile", Profile);


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


