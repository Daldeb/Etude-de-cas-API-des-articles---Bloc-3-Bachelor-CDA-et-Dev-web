const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../api/users/users.model");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw "not token";
    }
    const decoded = jwt.verify(token, config.secretJwtToken);
    
    // Récupérer l'utilisateur complet depuis la DB
    const user = await User.findById(decoded.userId, "-password");
    if (!user) {
      throw "User not found";
    }
    
    req.user = user;
    next();
  } catch (message) {
    next(new UnauthorizedError(message));
  }
};