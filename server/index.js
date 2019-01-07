const Sequelize = require("sequelize");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.static(path.resolve(__dirname, "..", "dist")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
  name: Sequelize.STRING,
  bought: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  buyer: Sequelize.STRING
});

Wish.sync().then(() => {
  Wish.create({ wish: "victor är bäst", name: "annie" });
  Wish.create({ wish: "kamera", name: "mamma", bought: true, buyer: "annie" });
  console.log("Logging!");
});

app.get("/api", (req, res) => res.send("Hello Server!"));

app.get("/api/wishes", async (req, res) => {
  const wishes = await Wish.findAll();
  res.send(wishes);
});

app.post("/api/wishes", async (req, res) => {
  const created = await Wish.create({
    name: req.body.name,
    wish: req.body.wish
  });
  const wishes = await Wish.findAll();
  res.send(wishes);
});

app.delete("/api/wishes/:id", async (req, res) => {
  const deleted = await Wish.destroy({
    where: {
      id: req.params.id
    }
  });
  const wishes = await Wish.findAll();
  res.send(wishes);
});

app.post("/api/wishes/:id", async (req, res) => {
  console.log("HELLO", req.body);
  const edited = await Wish.update(req.body, {
    where: {
      id: req.params.id
    }
  });
  const wishes = await Wish.findAll();
  console.log(wishes);
  res.send(wishes);
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "dist", "index.html"));
});

app.listen(3008, () => console.log("App is up and running!"));
