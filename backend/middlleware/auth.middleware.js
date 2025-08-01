import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    if (!Array.isArray(user.cartItems)) {
      user.cartItems = [];
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(`Error in protectRoute middleware: ${error.message}`);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Unauthorized - Token Expired" });
    }

    res.status(500).json({ message: "Unauthorized - Invalid Token" });
  }
};

export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: "Access denied - Admin only" });
};
