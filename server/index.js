const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.resolve(__dirname, "..", "dist")));

app.get("/api", (req, res) => res.send("Hello Server!"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "dist", "index.html"));
});

app.listen(3008, () => console.log("App is up and running!"));
