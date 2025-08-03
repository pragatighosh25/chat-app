//middleware to protect routes
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.json({ message: "Unauthorized", success: false });
  }
}