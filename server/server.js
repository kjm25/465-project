const express = require("express");
const app = express();
const path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const createPongGame = require("./games/Pong");

const port = process.env.PORT || 5001;

const activeRoomList = [];
const room = { numPlayers: 0, sockets: [] };

app.use(express.static(path.join(__dirname, "../client/dist")));

// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
// }); //this works

app.get("/", (req, res) => {
  console.log("redirect");
  res.status(302);
  res.redirect("./pong");

  //res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

app.get("/pong", (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

io.on("connection", (socket) => {
  console.log(`client with socket id ${socket.id} connected`);

  const roomName = "test_room"; // TODO change to room code sent by client once implemented
  joinRoom(roomName, socket);

  if (!activeRoomList.includes(roomName)) {
    //create game if not already created - will rework once flow is changed with create page
    activeRoomList.push(roomName);
    createPongGame(roomName, io, activeRoomList);
  }

  socket.on("disconnect", () => {
    console.log(`client with socket id ${socket.id} disconnected`);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const joinRoom = function (roomName, socket) {
  socket.join(roomName);
};

module.exports = { activeRoomList, io };
