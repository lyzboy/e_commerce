const express = require("express");
const session = require("express-session");
const { config } = require("dotenv");
config();
const passport = require("passport");
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
app.use(passport.session());

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
