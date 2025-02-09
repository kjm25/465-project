const express = require("express");
const app = express();
const path = require("path");

const port = process.env.PORT || 5001;

app.use(express.static(path.join(__dirname, "../client/dist")));

// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
// }); //this works

app.get("/", (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

app.get("/pong", (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
