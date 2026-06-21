import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodeToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decodeToken.userId;
    next();
  } catch (error) {
    console.error("Error in isAuth middleware:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
