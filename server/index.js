const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello Server!"));

app.listen(3008, () => console.log("App is up and running!"));
