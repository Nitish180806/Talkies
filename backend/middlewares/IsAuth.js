import jwt from "jsonwebtoken";

const IsAuth = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token not found" }); // Fixed status code
  }

  try {
    const VerifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = VerifyToken.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" }); // Fixed status code
  }
};

export default IsAuth;
