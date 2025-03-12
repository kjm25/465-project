const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.CLIENT_ID;
const google_client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
  //verify function for google login tokens
  try {
    const ticket = await google_client.verifyIdToken({
      idToken: token["credential"],
      audience: CLIENT_ID,
    });
    const verified_payload = ticket.getPayload();
    const email = verified_payload["email"];
    console.log(email, "just logged in");
    return email;
  } catch (err) {
    console.error(err); //code to be executed if an error occurs
    return "";
  }
}

module.exports = verify;
