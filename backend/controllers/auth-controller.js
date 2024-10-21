const authMiddleware = require("../middlewares/auth");

exports.createUser = async (req, res) => {
    console.log(req.body);
    //TODO: default user not admin
    const token = authMiddleware.generateAccessToken({
        username: req.body.username,
        role: "admin",
    });
    res.status(200).json(token);
};
