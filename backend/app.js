const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const categoryRoutes = require("./routes/category-routes");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "sfj&D636&^jdu", // Move secret to env in production
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

app.use('/api/v1/categories', categoryRoutes);

app.get("/", (req, res) => {
    res.json({ info: "Node.js, Express, and Postgres API" });
});

// // ACCOUNTS
// app.get("/login", (req, res) => {
//     res.send("log in to site");
// });
// app.post("/register", async (req, res) => {
//     const { username, password } = req.body;
//     const newUser = await db.users.createUser({ username, password });
//     if (newUser) {
//         res.status(201).json({
//             msg: "New user created!",
//             newUser,
//         });
//     } else {
//         res.status(500).json({ msg: "Unable to create user" });
//     }
// });
// app.post(
//     "/login",
//     passport.authenticate("local", { failureRedirect: "/login" }),
//     (req, res) => {
//         res.redirect("/login");
//     }
// );

// const getStates = (req, res) => {
//     query("SELECT * FROM states ORDER BY id ASC", (err, results) => {
//         if (err) {
//             throw err;
//         }
//         res.status(200).json(results.rows);
//     });
// };

module.exports = app; // Export app for testing

// Create a separate file for starting the server
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}
