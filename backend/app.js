const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { config } = require("dotenv");
config();
require("./config/passport-config");

const authRoutes = require("./routes/auth-routes");
const categoryRoutes = require("./routes/category-routes");
const productRoutes = require("./routes/product-routes");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.TOKEN_SECRET,
    cookie: { maxAge: 300000000, secure: false },
    saveUninitialized: false,
    resave: false,
    store: new session.MemoryStore(),
  })
);

app.use(passport.initialize());

passport.use(
  new LocalStrategy(function (username, password, done) {
    userModel.getUserByEmail(email, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.users.findByID(id, function (err, user) {
    if (err) {
      return done(err);
    }
    done(null, user);
  });
});

passport.use(
  new LocalStrategy(function (username, password, cb) {
    db.users.findByUsername(username, function (err, user) {
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false);
      }
      if (user.password != password) {
        return cb(null, false);
      }
      return cb(null, user);
    });
  })
);

app.use("/api/v1/user", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);

app.get("/", (req, res) => {
  res.json({ info: "Node.js, Express, and Postgres API" });
});

module.exports = app; // Export app for testing

// Create a separate file for starting the server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server started at: http://localhost:${port}`);
  });
}
