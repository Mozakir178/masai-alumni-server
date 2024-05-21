require("dotenv").config();
const jwt = require("jsonwebtoken");
async function ensureAuth(req, res, next) {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    console.log(verified);
    next();
  } catch (error) {
    res
      .status(500)
      .send({ message: "User not authorized", error: error.message });
  }
}

async function ensureAdminAuth(req, res, next) {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified.role === "admin") {
      req.user = verified;
      console.log(verified);
      next();
    } else {
       return res.status(403).send("Access Denied");
    }

   
  } catch (error) {
    res
      .status(500)
      .send({ message: "User not authorized", error: error.message });
  }
}

module.exports = { ensureAuth ,ensureAdminAuth};
