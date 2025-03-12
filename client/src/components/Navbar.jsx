import React, { useEffect, useState } from "react";
import { socket } from "../socket.js";
import "./Navbar.css";
import GoogleSign from "./GoogleSign.jsx";

function Navbar() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    socket.on("id_token", (array) => {
      console.log(array);
      document.cookie =
        "id_token=" +
        JSON.stringify(array[0]) +
        "; expires=" +
        new Date(array[1] * 1000).toUTCString() +
        "; SameSite=strict" +
        "; Secure" +
        "; path=/";
      setEmail(array[2]);
    });

    return () => {
      socket.removeAllListeners("id_token");
    };
  }, []);

  if (email === "")
    return (
      <nav className="navbar">
        <GoogleSign className="google"></GoogleSign>
      </nav>
    );
  else
    return (
      <nav className="navbar">
        <span className="username">{email}</span>
      </nav>
    );
}

export default Navbar;
