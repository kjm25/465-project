import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameButton from "./gameButton";
import "./GameSelector.css";

//create list of games to choose from with corresponding ID
const games = [
  { id: 1, name: "Pong" },
  { id: 2, name: "BattleShip" },
];

function GameSelector() {
  const [selectGame, setSelectGame] = useState(null);

  const handleSelectedGame = (game) => {
    setSelectGame(game);
  };

  return (
    <>
      <h1 className="game-selector">Choose a Game to Host</h1>
      <div className="game-container">
        {games.map((game) => (
          <GameButton key={game.id} game={game} />
        ))}
      </div>
      <button className="host-button">Host</button>
    </>
  );
}

export default GameSelector;
