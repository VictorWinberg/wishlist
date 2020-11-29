module.exports = (app, passport, { User, Wish }) => {
  const isLoggedIn = (req, res, next) => {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next();

    return res.sendStatus(401);
  };

  const callback = req => {
    const host = req.get("host");
    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const url = `${protocol}://${host}/auth/google/callback`;
    console.log(url);
    return url;
  };

  app.get("/auth/google", (req, res, next) => {
    passport.authenticate("google", {
      scope: ["profile", "email"], // ["https://www.googleapis.com/auth/plus.login"]
      callbackURL: callback(req)
    })(req, res, next);
  });

  app.get(
    "/auth/google/callback",
    (req, res, next) =>
      passport.authenticate("google", {
        callbackURL: callback(req)
      })(req, res, next),
    (req, res) => {
      res.cookie("name", req.user.name);
      res.redirect("/");
    }
  );

  app.get("/auth/me", (req, res) => res.send(req.user));

  app.get("/api", (req, res) => res.send("API is Running!"));

  app.get("/api/wishes", isLoggedIn, async (req, res) => {
    const wishes = await Wish.findAll();
    res.send(wishes);
  });

  app.get("/api/users", isLoggedIn, async (req, res) => {
    const users = await User.findAll();
    res.send(users);
  });

  app.post("/api/wishes", isLoggedIn, async (req, res) => {
    const created = await Wish.create({
      name: req.body.name,
      wish: req.body.wish
    });
    const wishes = await Wish.findAll();
    res.send(wishes);
  });

  app.delete("/api/wishes/:id", isLoggedIn, async (req, res) => {
    const deleted = await Wish.destroy({ where: { id: req.params.id } });
    const wishes = await Wish.findAll();
    res.send(wishes);
  });

  app.post("/api/wishes/:id", isLoggedIn, async (req, res) => {
    const edited = await Wish.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    const wishes = await Wish.findAll();
    res.send(wishes);
  });
};
