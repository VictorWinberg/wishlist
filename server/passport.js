const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const { find } = require("lodash");

module.exports = (passport, { User }) => {
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
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      },

      async function(accessToken, refreshToken, profile, done) {
        const users = await User.findAll();
        const user = find(users, { email: profile.emails[0].value });
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      }
    )
  );
};
