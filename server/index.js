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

app.get("/states", db.getStates);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
