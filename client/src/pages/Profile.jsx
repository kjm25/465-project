import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { socket } from "../socket";
import "./Lobby.css";

function Profile() {
  const [email, setEmail] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    socket.on("email", (newEmail) => {
      setEmail(newEmail);
    });
    socket.on("profileData", (profileData) => {
      setData(profileData);
    });
    socket.emit("getEmail");
    socket.emit("getProfile");

    return () => {
      socket.removeAllListeners("id_token");
      socket.removeAllListeners("email");
      socket.removeAllListeners("profileData");
    };
  }, []);

  return (
    <>
      <div className="d-flex flex-column align-self-center">
        <h1 className="game-font h1">{`Match history for ${email}`}</h1>
        <table className="table table-bordered table-hover mx-3 w-auto">
          <thead>
            <tr>
              <th>Winner</th>
              <th>Loser</th>
              <th>Score</th>
              <th>Game</th>
              <th>Time Played</th>
            </tr>
          </thead>
          <tbody>
            {data.map((game) => (
              <tr>
                <td>{game.winner}</td>
                <td>{game.loser}</td>
                <td>{game.score}</td>
                <td>{game.game}</td>
                <td>
                  {new Date(game.timestamp).toLocaleString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link className="btn w-auto mx-auto btn-info" to="/">
          Return to Main Menu
        </Link>
      </div>
    </>
  );
}

export default Profile;
