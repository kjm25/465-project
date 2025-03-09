import React from "react";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const gameConfigs = {
  pong: { name: "Pong", maxPlayers: 2 },
  battleship: { name: "Battleship", maxPlayers: 2 },
};

function Lobby() {
  const { roomID } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const gameName = location.state?.gameName || "pong";
  const gameConfig =
    gameConfigs[String(gameName).toLowerCase()] || gameConfigs.pong;

  const [players, setPlayers] = useState(["Host"]);
  const handleQuit = () => {};
  const handleStart = () => {};

  return (
    <div className="lobby-container">
      <h1>{gameConfig.name} Lobby</h1>
      <p>Room Code: {roomID}</p>
      <p>
        Players: {players.length} / {gameConfig.maxPlayers}
      </p>
      <ul>
        {players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
      <button onClick={handleQuit}>Quit</button>
      {players.length === gameConfig.maxPlayers && (
        <button onClick={handleStart}>Start</button>
      )}
    </div>
  );
}

export default Lobby;
