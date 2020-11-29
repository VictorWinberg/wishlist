const Sequelize = require("sequelize");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("cookie-session");
require("dotenv").config();

const app = express();

app.use(express.static(path.resolve(__dirname, "..", "dist")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());

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

const User = sequelize.define("user", {
  name: Sequelize.STRING,
  email: Sequelize.STRING
});

Wish.sync().then(() => {
  console.log("Wish database running!");
});

require("./passport")(passport, { User });
require("./routes")(app, passport, { User, Wish });

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "dist", "index.html"));
});

app.listen(3008, () => console.log("App is up and running!"));
