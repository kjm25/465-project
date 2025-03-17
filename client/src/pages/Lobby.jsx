import React from "react";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { socket } from "../socket.js";
import "./Lobby.css";

const gameConfigs = {
  pong: { name: "Pong", maxPlayers: 2 },
  connect4: { name: "Connect4", maxPlayers: 2 },
};

function Lobby() {
  const { roomID } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [gameConfig, setGameConfig] = useState({
    name: "Disconnected",
    maxPlayers: 2,
  });
  const [disabledClass, setDisabledClass] = useState("disabled btn-dark");
  const [players, setPlayers] = useState([1]);

  // will need client logic to make this work
  useEffect(() => {
    //get game selection from server for configs
    socket.on("sendGame", (gameName) => {
      if (gameName === "pong") {
        setGameConfig(gameConfigs.pong);
      } else if (gameName === "connect4") {
        setGameConfig(gameConfigs.connect4);
      }
    });
    socket.emit("getGame");

    return () => {
      socket.removeAllListeners("sendGame");
    };
  }, []);

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

    socket.on("connect4Start", () => {
      navigate(`/connect4`);
    });

    socket.on("lobbyCount", (count) => setPlayers(count));

    return () => {
      socket.removeAllListeners("pongStart");
      socket.removeAllListeners("connect4Start");
      socket.removeAllListeners("lobbyCount");
    };
  }, []);

  useEffect(() => {
    //disable button if less than required players
    if (players >= gameConfig.maxPlayers) setDisabledClass("btn-success");
    else if (players < gameConfig.maxPlayers)
      setDisabledClass("disabled btn-dark");
  }, [players]);

  return (
    <div className="lobby-container game-font">
      <header>
        <h1 className="display-1">{gameConfig.name} Lobby</h1>
      </header>
      <main>
        <p>Room Code: {roomID}</p>
        <p>
          Players: {players} / {gameConfig.maxPlayers}
        </p>

        <button className="btn btn-lg btn-danger m-2" onClick={handleQuit}>
          Quit
        </button>

        <button
          className={`btn btn-lg m-2 ${disabledClass}`}
          onClick={handleStart}
        >
          Start
        </button>
      </main>
    </div>
  );
}

export default Lobby;
