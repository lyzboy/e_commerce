const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

//get config vars
dotenv.config();

// access config var for the token secret
const tokenSecret = process.env.TOKEN_SECRET;

/*
app.post('/api/createNewUser', (req, res) => {
    // ...
  
    const token = generateAccessToken({ username: req.body.username });
    res.json(token);
  
    // ...
  });

  cookie storage
  // get token from fetch request
    const token = await res.json();

    // set token in cookie
    document.cookie = `token=${token}`
*/

exports.generateAccessToken = (payload) => {
    // expires in 30 mins
    return jwt.sign(payload, tokenSecret, { expiresIn: "1800s" });
};

exports.authenticateToken = (req, res, next) => {
    // get the authorization header
    const authHeader = req.headers["authorization"];
    //
    const token = authHeader && authHeader.split(" ")[1];

    // if no token, return 401 status
    if (!token) return res.status(401).json({ message: "No auth token" });

    jwt.verify(token, tokenSecret, (err, user) => {
        if (err) {
            return res
                .status(403)
                .json({ message: "Authentication error: " + err.message });
        }
        req.user = user;

        next();
    });
};

exports.checkAdminRole = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
    }

    next();
};
