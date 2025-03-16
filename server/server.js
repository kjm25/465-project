const express = require("express");
const app = express();
const path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const createPongGame = require("./games/Pong");
const verify = require("./auth.js");
const cookieLib = require("cookie");
const { dbGetData, dbSendResult } = require("./database.js");
const createConnect4 = require("./games/Connect4.js");
require("dotenv").config();

const port = process.env.PORT || 5001;

const activeRoomList = [];
class room {
  constructor(numPlayers = 0, sockets = [], name = "", gameType = "") {
    this.numPlayers = numPlayers;
    this.sockets = sockets;
    this.name = name;
    this.gameType = gameType;
  }
}

const signIn = function (socket) {
  const cookies = socket.handshake.headers.cookie; //try to log user in with cookies
  try {
    const token = JSON.parse(cookieLib.parse(cookies)["id_token"]);
    return verify(token, socket);
  } catch {
    return "";
  }
};

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

io.on("connection", (socket) => {
  console.log(`client with socket id ${socket.id} connected`);

  let roomName = "";
  let gameRoom = new room();
  socket.userEmail = signIn(socket);

  socket.on("joinRoom", (roomCode) => {
    if (roomName != "") leaveRoom(roomName, socket);

    roomName = roomCode;
    gameRoom = joinRoom(roomName, socket, gameRoom);
    io.to(roomName).emit("lobbyCount", gameRoom.numPlayers);
  });

  socket.on("getEmail", async () => {
    socket.emit("email", await socket.userEmail);
  });

  socket.on("getProfile", async () => {
    const profileData = await dbGetData(await socket.userEmail);
    socket.emit("profileData", profileData);
  });

  socket.on("leaveRoom", (roomCode) => {
    if (roomName != "") {
      leaveRoom(roomName, socket);
    }

    roomName = "";
    gameRoom = new room();
  });

  socket.on("setGame", (game) => {
    gameRoom.gameType = game;
  });
  socket.on("getGame", () => {
    socket.emit("sendGame", gameRoom.gameType);
  });
  socket.on("startGame", () => {
    if (roomName != "") {
      //!activeRoomList.includes(roomName) &&
      //create game if not already created
      if (gameRoom.gameType === "pong") {
        io.to(roomName).emit("pongStart");
        createPongGame(roomName, io, activeRoomList, gameRoom);
      } else if (gameRoom.gameType === "connect4") {
        io.to(roomName).emit("connect4Start");
        createConnect4(roomName, io, activeRoomList, gameRoom);
      }
    }
  });

  socket.on("google_sign", (credential) => {
    socket.userEmail = verify(credential, socket);
    //add cookie response
  });

  socket.on("disconnect", () => {
    leaveRoom(roomName, socket);
    console.log(`client with socket id ${socket.id} disconnected`);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const joinRoom = function (roomName, socket, newGame) {
  const roomIndex = activeRoomList.findIndex((room) => room.name === roomName);
  socket.join(roomName);
  if (roomIndex === -1) {
    newGame.numPlayers += 1;
    newGame.sockets.push(socket);
    newGame.name = roomName;
    activeRoomList.push(newGame);
    return newGame;
  } else {
    const currentGame = activeRoomList[roomIndex];
    console.log(currentGame.numPlayers, "before join");
    currentGame.numPlayers += 1;
    currentGame.sockets.push(socket);
    console.log(currentGame.numPlayers, "after join");
    return currentGame;
  }
};

const leaveRoom = function (roomName, socket) {
  console.log(roomName, "leaving room");
  const roomIndex = activeRoomList.findIndex((room) => room.name === roomName);
  if (roomIndex >= 0) {
    const currentRoom = activeRoomList[roomIndex];
    currentRoom.numPlayers -= 1;
    const socketIndex = currentRoom.sockets.indexOf(socket);
    if (socketIndex !== -1) {
      //remove socket from list
      currentRoom.sockets.splice(socketIndex, 1);
    }
    io.to(roomName).emit("lobbyCount", currentRoom.numPlayers);
    console.log(currentRoom.numPlayers, "leave");

    if ((currentRoom.numPlayers = 0)) {
      //remove room if empty
      activeRoomList.splice(roomIndex, 1);
    }
  }
};
