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
  const [selectedGame, setSelectedGame] = useState(null);
  const navigate = useNavigate();

  const generateRoomID = () => {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  };

  const handleHostGame = () => {
    if (!selectedGame) return;

    const roomID = generateRoomID();
    navigate(`/lobby/${roomID}`, { state: { gameName: selectedGame } });
  };

  return (
    <>
      <h1 className="game-selector">Choose a Game to Host</h1>
      <div className="game-container">
        {games.map((game) => (
          <GameButton
            key={game.id}
            game={game}
            isSelected={selectedGame === game.id}
            onSelect={setSelectedGame}
          />
        ))}
      </div>
      <button
        className="host-button"
        onClick={handleHostGame}
        disabled={!selectedGame}
      >
        Host
      </button>
    </>
  );
}

export default GameSelector;
