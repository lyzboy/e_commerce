const dotenv = require("dotenv");

//get config vars
dotenv.config();

// access config var for the token secret
process.env.TOKEN_SECRET;

/*
app.post('/api/createNewUser', (req, res) => {
    // ...
  
    const token = generateAccessToken({ username: req.body.username });
    res.json(token);
  
    // ...
  });
*/

exports.generateAccessToken = (id) => {
    // expires in 30 mins
    return jwt.sign(id, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
};
