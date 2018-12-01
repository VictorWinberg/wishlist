const Sequelize = require("sequelize");
const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

const sequelize = new Sequelize(
  process.env.SEQUELIZE_DB,
  process.env.SEQUELIZE_USERNAME,
  process.env.SEQUELIZE_PASSWORD,
  {
    host: process.env.SEQUELIZE_HOST,
    dialect: "postgres",
    operatorsAliases: false
  }
);

const Wish = sequelize.define("wish", {
  wish: Sequelize.STRING,
  name: Sequelize.STRING
});

Wish.sync({ force: true }).then(() => {
  Wish.create({ wish: "victor", name: "annie" });
  Wish.create({ wish: "mer victor", name: "annie" });
  Wish.create({ wish: "ännu mer victor", name: "annie" });
});

app.use(express.static(path.resolve(__dirname, "..", "dist")));

app.get("/api", (req, res) => res.send("Hello Server!"));

app.get("/api/wishes", async (req, res) => {
  const wishes = await Wish.findAll();
  res.send(wishes);
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "dist", "index.html"));
});

app.listen(3008, () => console.log("App is up and running!"));
