const express = require("express");
const app = express();
const path = require("path");

const port = process.env.PORT || 5001;

app.use(express.static("../client/dist"));

app.get("/", (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname + "../client/dist"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
