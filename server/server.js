const express = require("express");
const app = express();
const path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = process.env.PORT || 5001;

const activeRoomList = new Set();

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

  if (!activeRoomList.has(roomName)) {
    //create game if not already created - will rework once flow is changed with create page
    activeRoomList.add(roomName);
    createPongGame(roomName);
  }

  socket.on("disconnect", () => {
    console.log(`client with socket id ${socket.id} disconnected`);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const createPongGame = function (roomName) {
  let firstRun = true;
  let gameSentCount = 0;
  const moveUp = (prevPos) => Math.max(prevPos - 5, 0);
  const moveDown = (prevPos) => Math.min(prevPos + 5, 100);
  const gameState = {
    //starting gamestate
    ballPos: [50, 50, 1, 1],
    score: [0, 0],
    redPos: 50,
    bluePos: 50,
  };

  const interval = setInterval(async () => {
    const sockets = await io.to(roomName).fetchSockets();
    if (sockets.length === 0) {
      activeRoomList.delete(roomName);
      clearInterval(interval); //stop the game if all players have left
    } else if (sockets.length === 1) {
      return; //return if only one player
    } else {
      if (firstRun) {
        //first loop logic setupt
        firstRun = false;
        sockets[0].emit("color", "red");
        sockets[1].emit("color", "blue");

        sockets[0].on("pongUp", () => {
          sockets[1].emit("pongUp");
          gameState.redPos = moveUp(gameState.redPos);
        });
        sockets[0].on("pongDown", () => {
          sockets[1].emit("pongDown");
          gameState.redPos = moveDown(gameState.redPos);
        });

        sockets[1].on("pongUp", () => {
          sockets[0].emit("pongUp");
          gameState.bluePos = moveUp(gameState.bluePos);
        });
        sockets[1].on("pongDown", () => {
          sockets[0].emit("pongDown");
          gameState.bluePos = moveDown(gameState.bluePos);
        });

        io.to(roomName).emit("pongGameState", gameState);
      }

      const prevGameState = structuredClone(gameState); //calculate one tick of game updates
      if (gameState.ballPos[0] < 0) {
        gameState.score[0] += 1;
        gameState.ballPos = [25, 50, 1, prevGameState.ballPos[3]];
      } else if (gameState.ballPos[0] > 100) {
        gameState.score[1] += 1;
        gameState.ballPos = [25, 50, 1, prevGameState.ballPos[3]];
      } else {
        if (
          //check a player hit the ball (hitboxes can be looked at)
          prevGameState.ballPos[0] + prevGameState.ballPos[2] <= 4 &&
          prevGameState.redPos - prevGameState.ballPos[1] >= -5 &&
          prevGameState.redPos - prevGameState.ballPos[1] <= 12
        )
          gameState.ballPos[2] = Math.abs(prevGameState.ballPos[2]);
        else if (
          prevGameState.ballPos[0] + prevGameState.ballPos[2] >= 96 &&
          prevGameState.bluePos - prevGameState.ballPos[1] >= -5 &&
          prevGameState.bluePos - prevGameState.ballPos[1] <= 12
        )
          gameState.ballPos[2] = -Math.abs(prevGameState.ballPos[2]);

        //check if player hit a wall
        if (prevGameState.ballPos[1] + prevGameState.ballPos[3] <= 0)
          gameState.ballPos[3] = Math.abs(prevGameState.ballPos[3]);
        else if (prevGameState.ballPos[1] + prevGameState.ballPos[3] >= 100)
          gameState.ballPos[3] = -Math.abs(prevGameState.ballPos[3]);

        //update position based on velocity - old velocity used to match client
        gameState.ballPos[0] =
          prevGameState.ballPos[0] + prevGameState.ballPos[2];
        gameState.ballPos[1] =
          prevGameState.ballPos[1] + prevGameState.ballPos[3];
      }

      //Send the gamestate to avoid desyncs. Sending too often removes smoothness of client side running

      if (gameSentCount > 60) {
        io.to(roomName).emit("pongGameState", gameState);
        gameSentCount = 0;
      } else gameSentCount += 1;
    }
  }, 30); //use 30ms for game logic updates when in code
};
