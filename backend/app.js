const express = require("express");
const session = require("express-session");
require("dotenv").config();
const passport = require("passport");
require("./config/passport-config");

const authRoutes = require("./routes/auth-routes");
const categoryRoutes = require("./routes/category-routes");
const productRoutes = require("./routes/product-routes");
const cartRoutes = require("./routes/carts-routes");
const discountRoutes = require("./routes/discounts-routes");
const userRoutes = require("./routes/user-routes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

app.use(
  session({
    secret: process.env.TOKEN_SECRET,
    cookie: { maxAge: 1800000, secure: false }, //<- Set secure to true for production
    saveUninitialized: false,
    resave: false,
    store: new session.MemoryStore(),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/carts", cartRoutes);
app.use("/api/v1/discounts", discountRoutes);
app.use("/api/v1/users", userRoutes);

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
