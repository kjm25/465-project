const { dbSendResult } = require("../database");

//game creation functions - might be moved to another file
const createConnect4 = function (roomName, io, activeRoomList, room) {
  let firstRun = true;
  let emails = [];
  //starting gamestate
  const gameState = {
    data: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ],
    player0Turn: true,
    winner: "",
  };
  const dropPiece = function (col) {
    if (col > 6 || col < 0) return;
    let index = 0;
    if (gameState.data[col][index] !== 0) return; //column is full
    while (gameState.data[col][index] === 0 && index <= 5) {
      index += 1;
    }
    if (gameState.player0Turn) gameState.data[col][index - 1] = 1;
    else gameState.data[col][index - 1] = 2;
    gameState.player0Turn = !gameState.player0Turn;
  };

  if (room.sockets.length == 2) {
    //set up game over sockets
    room.sockets[0].emit("connect4Player0", true);
    room.sockets[1].emit("connect4Player0", false);
    io.to(roomName).emit("connect4GameState", gameState);

    room.sockets[0].on("connect4Drop", (col) => {
      if (gameState.player0Turn) dropPiece(col);
      io.to(roomName).emit("connect4GameState", gameState);
    });
    room.sockets[1].on("connect4Drop", (col) => {
      if (!gameState.player0Turn) dropPiece(col);
      io.to(roomName).emit("connect4GameState", gameState);
    });
  }
};

module.exports = createConnect4;
