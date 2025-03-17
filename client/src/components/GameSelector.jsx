import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameButton from "./GameButton.jsx";
import "./GameSelector.css";
import { socket } from "../socket.js";

//create list of games to choose from with corresponding ID
const games = [
  { id: 1, name: "Pong" },
  { id: 2, name: "Connect4" },
];

function GameSelector() {
  const [selectedGame, setSelectedGame] = useState(null);
  const navigate = useNavigate();

  const generateRoomID = () => {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  };

  const handleHostGame = (game_id) => {
    const roomID = generateRoomID();
    if (game_id == 1) {
      socket.emit("setGame", "pong");
      socket.emit("joinRoom", roomID);
    } else if (game_id == 2) {
      socket.emit("setGame", "connect4");
      socket.emit("joinRoom", roomID);
    }
    navigate(`/lobby/${roomID}`, { state: { gameName: selectedGame } });
  };

  return (
    <>
      <header>
        <h1 className="game-selector">Choose a Game to Host</h1>
      </header>
      <main className="game-container">
        {games.map((game) => (
          <GameButton
            key={game.id}
            game={game}
            isSelected={selectedGame === game.id}
            onSelect={handleHostGame}
          />
        ))}
      </main>
      {/* <button
        className="host-button"
        //onClick={handleHostGame}
        disabled={!selectedGame}
      >
        Host
      </button> */}
    </>
  );
}

export default GameSelector;
