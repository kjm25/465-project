const { dbSendResult } = require("../database");

//game creation functions - might be moved to another file
const createConnect4 = async function (roomName, io, activeRoomList, room) {
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
    //function to fill last available spot with correct number based on current player's turn
    if (col > 6 || col < 0) return;
    let index = 0;
    if (gameState.data[col][index] !== 0) return; //column is full
    while (gameState.data[col][index] === 0 && index <= 5) {
      index += 1;
    }
    if (gameState.player0Turn) gameState.data[col][index - 1] = 1;
    else gameState.data[col][index - 1] = 2;
    gameState.player0Turn = !gameState.player0Turn;
    gameState.winner = gameWon(gameState.data);
    if (emails[0] != "Anonymous Player" || emails[1] != "Anonymous Player") {
      if (gameState.winner === "Red") {
        dbSendResult(emails[0], emails[1], "", "Connect4");
      } else if (gameState.winner === "Yellow") {
        dbSendResult(emails[1], emails[0], "", "Connect4");
      } else if (gameState.winner === "Draw") {
        dbSendResult(emails[0], emails[1], "Draw", "Connect4");
      }
    }
  };

  if (room.sockets.length == 2) {
    //set up game over sockets
    room.sockets[0].emit("connect4Player0", true);
    room.sockets[1].emit("connect4Player0", false);
    io.to(roomName).emit("connect4GameState", gameState);
    //send again in case they get gameState before what player they are
    setTimeout(() => io.to(roomName).emit("connect4GameState", gameState), 200);

    room.sockets[0].on("connect4Drop", (col) => {
      if (gameState.player0Turn) dropPiece(col);
      io.to(roomName).emit("connect4GameState", gameState);
    });
    room.sockets[1].on("connect4Drop", (col) => {
      if (!gameState.player0Turn) dropPiece(col);
      io.to(roomName).emit("connect4GameState", gameState);
    });

    emails = [await room.sockets[0].userEmail, await room.sockets[1].userEmail];
    if (emails[0] === "") emails[0] = "Anonymous Player";
    if (emails[1] === "") emails[1] = "Anonymous Player";
  }
};

const gameWon = function (board) {
  if (!board.some((col) => col.includes(0))) return "Draw";

  const checkDirection = function (col, row, deltaCol, deltaRow) {
    let lastToken = board[col][row];
    let tokenCount = 0;

    while (col >= 0 && row >= 0 && col <= 6 && row <= 5) {
      //move through the delta tracking how many of the same token have been seen
      if (lastToken != 0 && board[col][row] === lastToken) tokenCount += 1;
      else if (board[col][row] !== 0) tokenCount = 1;
      else tokenCount = 0;
      lastToken = board[col][row];
      col += deltaCol;
      row += deltaRow;
      if (tokenCount >= 4) {
        if (lastToken === 1) return "Red";
        else return "Yellow";
      }
    }
    return "";
  };

  let c = 0;
  let r = 0;
  let result = "";

  while (c <= 6) {
    //check columns
    result = checkDirection(c, 0, 0, 1);
    if (result != "") return result;
    c += 1;
  }

  while (r <= 5) {
    //check rows
    result = checkDirection(0, r, 1, 0);
    if (result != "") return result;
    r += 1;
  }

  //start diagonal logic - move in both directions for all possibilites - inefficient but easy
  c = 0;
  r = 0;
  while (c <= 6) {
    result = checkDirection(c, 0, 1, 1);
    if (result != "") return result;
    c += 1;
  }
  while (r <= 5) {
    result = checkDirection(0, r, 1, 1);
    if (result != "") return result;
    r += 1;
  }
  c = 0;
  r = 0;
  while (c <= 6) {
    result = checkDirection(c, 0, -1, 1);
    if (result != "") return result;
    c += 1;
  }
  while (r <= 5) {
    result = checkDirection(6, r, -1, 1);
    if (result != "") return result;
    r += 1;
  }

  return "";
};

module.exports = createConnect4;
