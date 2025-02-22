import React from "react";
import GameButton from "./gameButton";
import "./GameSelect.css";

//create list of games to choose from with corresponding ID
const games = [
  { id: 1, name: "Pong" },
  { id: 2, name: "Game 2" },
  { id: 3, name: "Game 3 " },
];

//Make GameSelect
function GameSelect() {
  return (
    <>
      <h1 className="game-selector">Choose a Game to Host</h1>
      <div className="game-container">
        {games.map((game) => (
          <GameButton key={game.id} game={game} />
        ))}
      </div>
    </>
  );
}

export default GameSelect;
