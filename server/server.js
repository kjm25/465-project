const express = require("express");
const app = express();
const path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const createPongGame = require("./games/Pong");

const port = process.env.PORT || 5001;

const activeRoomList = [];
class room {
  constructor(numPlayers = 0, sockets = [], name = "") {
    this.numPlayers = numPlayers;
    this.sockets = sockets;
    this.name = name;
  }
}

app.use(express.static(path.join(__dirname, "../client/dist")));

// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
// }); //this works

app.get("/", (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

app.get("/pong", (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

io.on("connection", (socket) => {
  console.log(`client with socket id ${socket.id} connected`);

  const roomName = "test_room"; // TODO change to room code sent by client once implemented
  const gameRoom = joinRoom(roomName, socket);

  if (!activeRoomList.includes(roomName)) {
    //create game if not already created - will rework once flow is changed with create page
    activeRoomList.push(roomName);
    createPongGame(roomName, io, activeRoomList, gameRoom);
  }

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
    room.numPlayers -= 1;
    const socketIndex = array.indexOf(socket);
    if (socketIndex !== -1) {
      //remove socket from list
      room.sockets.splice(socketIndex, 1);
    }

    if ((room.numPlayers = 0)) {
      //remove room if empty
      activeRoomList.splice(roomIndex, 1);
    }
  }
};
