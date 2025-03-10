//game creation functions - might be moved to another file
const createPongGame = function (roomName, io, activeRoomList) {
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
  const isCollision = function (paddlePos, ballPos) {
    const hitboxWidth = 19;
    const fraction = paddlePos / 100;
    const lowerBound = paddlePos - hitboxWidth * fraction;
    const upperBound = lowerBound + hitboxWidth;

    return ballPos >= lowerBound && ballPos <= upperBound;
  };

  const interval = setInterval(async () => {
    const sockets = await io.to(roomName).fetchSockets();
    if (sockets.length === 0) {
      //activeRoomList.delete(roomName); TODO add a delete function
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
        io.to(roomName).emit("pongGameState", gameState);
      } else if (gameState.ballPos[0] > 100) {
        gameState.score[1] += 1;
        gameState.ballPos = [25, 50, 1, prevGameState.ballPos[3]];
        io.to(roomName).emit("pongGameState", gameState);
      } else {
        if (
          //check a player hit the ball (hitboxes can be looked at)
          prevGameState.ballPos[0] + prevGameState.ballPos[2] <= 4 &&
          isCollision(gameState.redPos, prevGameState.ballPos[1])
          // prevGameState.redPos - prevGameState.ballPos[1] >= -5 &&
          // prevGameState.redPos - prevGameState.ballPos[1] <= 12
        )
          gameState.ballPos[2] = Math.abs(prevGameState.ballPos[2]);
        else if (
          prevGameState.ballPos[0] + prevGameState.ballPos[2] >= 96 &&
          isCollision(gameState.bluePos, prevGameState.ballPos[1])
          // prevGameState.bluePos - prevGameState.ballPos[1] >= -5 &&
          // prevGameState.bluePos - prevGameState.ballPos[1] <= 12
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

      //currently just sync game on scores - let clients run smoothly
      //Send the gamestate to avoid desyncs. Sending too often removes smoothness of client side running.
      // if (gameSentCount > 60) {
      //   io.to(roomName).emit("pongGameState", gameState);
      //   gameSentCount = 0;
      // } else gameSentCount += 1;
    }
  }, 30); //use 30ms for game logic updates when in code
};

module.exports = createPongGame;
