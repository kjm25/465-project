import React, { useEffect } from "react";
import { socket } from "../socket.js";

import { GoogleLogin } from "@react-oauth/google";

function GoogleSign() {
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
    });

    return () => {};
  }, []);

  return (
    <div className="googleContainer">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          socket.emit("google_sign", credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
        // useOneTap
      />
      ;
    </div>
  );
}

export default GoogleSign;
