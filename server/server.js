const express = require("express");
const app = express();
const path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = process.env.PORT || 5001;

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
  socket.join(roomName);

  socket.to(roomName).emit("color", "red");

  //simply emit actions to the other client - will want game logic on server eventually to have ground truth
  socket.on("pongUp", () => socket.to(roomName).emit("pongUp"));
  socket.on("pongDown", () => socket.to(roomName).emit("pongDown"));

  socket.on("disconnect", () => {
    console.log(`client with socket id ${socket.id} disconnected`);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
