const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db/queries");
const session = require("express-session");
const store = new session.MemoryStore();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: "sfj&D636&^jdu", // Move secret to env in production
        cookie: { maxAge: 300000000, secure: false },
        saveUninitialized: false,
        resave: false,
        store,
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

app.get("/", (req, res) => {
    res.json({ info: "Node.js, Express, and Postgres API" });
});

// ACCOUNTS
app.get("/login", (req, res) => {
    res.send("log in to site");
});
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const newUser = await db.users.createUser({ username, password });
    if (newUser) {
        res.status(201).json({
            msg: "New user created!",
            newUser,
        });
    } else {
        res.status(500).json({ msg: "Unable to create user" });
    }
});
app.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("/login");
    }
);

// Categories
app.get("/api/v1/categories", async (req, res) => {
    try {
        const results = await db.getCategories(req, res);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: "Server error:" + err.message });
    }
});

app.post("/api/v1/categories", async (req, res) => {
    try {
        const results = await db.createCategory(req.body);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: "Server Error:" + err.message });
    }
});

module.exports = app; // Export app for testing

// Create a separate file for starting the server
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}
