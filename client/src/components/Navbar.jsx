import React, { useEffect, useState } from "react";
import { socket } from "../socket.js";
import "./Navbar.css";
import GoogleSign from "./GoogleSign.jsx";
import { googleLogout } from "@react-oauth/google";
import { Link } from "react-router-dom";

function Navbar() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    socket.on("id_token", (array) => {
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
    socket.on("email", (newEmail) => {
      setEmail(newEmail);
    });

    socket.emit("getEmail");

    return () => {
      socket.removeAllListeners("id_token");
      socket.removeAllListeners("email");
    };
  }, []);

  const signout = function () {
    document.cookie =
      "id_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    googleLogout();
    window.location.reload();
  };

  if (email === "")
    return (
      <nav className="navbar">
        <GoogleSign className="google"></GoogleSign>
      </nav>
    );
  else
    return (
      <>
        <nav className="navbar">
          <Link
            className="btn btn-info pl-3"
            to="/profile"
          >{`Profile: ${email}`}</Link>
          <button className="btn btn-danger px-3" onClick={signout}>
            Sign Out
          </button>
        </nav>
      </>
    );
}

export default Navbar;
