const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header) return res.status(401).json({ message: "Missing token" });
    const token = header.replace("Bearer ", "");
    const secret = process.env.JWT_SECRET || "dev_secret";
    const payload = jwt.verify(token, secret);
    req.user = { id: payload.id };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


