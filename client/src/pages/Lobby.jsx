import React from "react";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { socket } from "../socket.js";
import "./Lobby.css";

const gameConfigs = {
  pong: { name: "Pong", maxPlayers: 2 },
  battleship: { name: "Battleship", maxPlayers: 2 },
};

function Lobby() {
  const { roomID } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // will need client logic to make this work
  const gameName = location.state?.gameName || "Pong";
  // const gameConfig =
  //   gameConfigs[String(gameName).toLowerCase()] || gameConfigs.pong;
  const gameConfig = gameConfigs.pong;
  const [disabledClass, setDisabledClass] = useState("disabled");

  const [players, setPlayers] = useState([1]);

  const handleQuit = () => {
    socket.emit("leaveRoom");
    window.location.replace("/");
  };
  const handleStart = () => {
    if (players < gameConfig.maxPlayers) {
      //need to give error message to user
    } else {
      socket.emit("startGame");
    }
  };

  useEffect(() => {
    socket.on("pongStart", () => {
      navigate(`/pong`);
    });

    socket.on("lobbyCount", (count) => setPlayers(count));

    return () => {
      socket.removeAllListeners("pongStart");
      socket.removeAllListeners("lobbyCount");
      navigate(`/pong`);
    };
  }, []);

  useEffect(() => {
    if (players >= gameConfig.maxPlayers) setDisabledClass("");
    else if (players < gameConfig.maxPlayers) setDisabledClass("disabled");
  }, [players]);

  return (
    <div className="lobby-container game-font">
      <h1 className="display-1">{gameConfig.name} Lobby</h1>
      <p>Room Code: {roomID}</p>
      <p>
        Players: {players} / {gameConfig.maxPlayers}
      </p>

      <button className="btn btn-lg btn-danger m-2" onClick={handleQuit}>
        Quit
      </button>

      <button
        className={`btn btn-lg btn-success m-2 ${disabledClass}`}
        onClick={handleStart}
      >
        Start
      </button>
    </div>
  );
}

export default Lobby;
