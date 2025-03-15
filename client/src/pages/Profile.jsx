import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { socket } from "../socket";

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
      <h2>{`Match history for ${email}`}</h2>
      <table className="table table-bordered table-hover">
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
      <Link className="btn btn-info" to="/">
        Return to Main Menu
      </Link>
    </>
  );
}

export default Profile;
