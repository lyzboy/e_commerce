const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db/queries");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ info: "Node.js, Express, and Postgres API" });
});

// ACCOUNTS
app.post("/register", (req, res) => {
    res.send("User registered successfully");
});
app.post("/login", (req, res) => {
    res.send("User logged in successfully");
});
app.get("/profile/:email", (req, res) => {
    const email = req.params.email;
    res.send(`Retrieved use with email of ${email}`);
});
app.put("/profile/:email", (req, res) => {
    res.send("User profile updated");
});
app.post("/logout", (req, res) => {
    res.send("User logged out");
});

// PRODUCTS
app.get("/products", (req, res) => {
    const productDetails = req.query;
    // return the queries for testing
    res.json(productDetails);
});
app.post("/products", (req, res) => {
    const newProduct = req.body;
    res.json(newProduct);
});
app.get("/products/:id", (req, res) => {
    const id = req.params.id;
    res.send(`Getting product with id ${id}`);
});
app.delete("/products/:id", (req, res) => {
    const id = req.params.id;
    res.send(`Deleting product with id ${id}`);
});
app.put("/products/:id", (req, res) => {
    const id = req.params.id;
    res.send(`Updating product with id ${id}`);
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
