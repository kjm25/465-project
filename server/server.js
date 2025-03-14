const express = require("express");
const app = express();
const path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const createPongGame = require("./games/Pong");
const verify = require("./auth.js");
const cookieLib = require("cookie");

const port = process.env.PORT || 5001;

const activeRoomList = [];
class room {
  constructor(numPlayers = 0, sockets = [], name = "") {
    this.numPlayers = numPlayers;
    this.sockets = sockets;
    this.name = name;
  }
}

const signIn = function (socket) {
  const cookies = socket.handshake.headers.cookie; //try to log user in with cookies
  try {
    const token = JSON.parse(cookieLib.parse(cookies)["id_token"]);
    return verify(token, socket);
  } catch {
    console.log("Failed to read cookie");
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
  let gameRoom = undefined;
  let gameType = "";
  let email = signIn(socket);

  socket.on("joinRoom", (roomCode) => {
    if (roomName != "") leaveRoom(roomName, socket);

    roomName = roomCode;
    gameRoom = joinRoom(roomName, socket);
    io.to(roomName).emit("lobbyCount", gameRoom.numPlayers);
  });

  socket.on("leaveRoom", (roomCode) => {
    if (roomName != "") {
      leaveRoom(roomName, socket);
    }

    roomName = "";
    gameRoom = undefined;
  });

  socket.on("setGame", (game) => (gameType = game));
  socket.on("startGame", () => {
    if (roomName != "") {
      //!activeRoomList.includes(roomName) &&
      //create game if not already created
      if ((gameType = "pong")) {
        io.to(roomName).emit("pongStart");
        createPongGame(roomName, io, activeRoomList, gameRoom);
      }
    }
  });

  socket.on("google_sign", (credential) => {
    email = verify(credential, socket);
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

const joinRoom = function (roomName, socket) {
  const roomIndex = activeRoomList.findIndex((room) => room.name === roomName);
  socket.join(roomName);
  if (roomIndex === -1) {
    const newGame = new room();
    newGame.numPlayers += 1;
    newGame.sockets.push(socket);
    newGame.name = roomName;
    activeRoomList.push(newGame);
    return newGame;
  } else {
    const currentGame = activeRoomList[roomIndex];
    currentGame.numPlayers += 1;
    currentGame.sockets.push(socket);
    return currentGame;
  }
};

const leaveRoom = function (roomName, socket) {
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

    if ((currentRoom.numPlayers = 0)) {
      //remove room if empty
      activeRoomList.splice(roomIndex, 1);
    }
  }
};
