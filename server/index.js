const Sequelize = require("sequelize");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const { find } = require("lodash");
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
  console.log("Logging!");
});

passport.serializeUser(function(user, done) {
  done(null, user.name);
});

passport.deserializeUser(function(name, done) {
  done(null, { name });
});

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },

    async function(accessToken, refreshToken, profile, done) {
      const users = await User.findAll();
      const user = find(users, { email: profile.emails[0].value });
      if (user) {
        return done(null, user);
      }
      return done({ success: false, message: "401 Unauthorized" });
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"] // ["https://www.googleapis.com/auth/plus.login"]
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    res.cookie("name", req.user.name);
    res.redirect("/");
  }
);

app.get("/auth/me", (req, res) => res.send(req.user));

app.get("/api", (req, res) => res.send("Hello Server!"));

app.get("/api/wishes", async (req, res) => {
  const wishes = await Wish.findAll();
  res.send(wishes);
});

app.get("/api/users", async (req, res) => {
  const users = await User.findAll();
  res.send(users);
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
