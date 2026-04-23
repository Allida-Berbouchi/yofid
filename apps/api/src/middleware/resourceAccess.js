import User from "../models/User.js";

export async function requireCreatorOrAdmin(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("role creator");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin" && !user.creator) {
      return res.status(403).json({
        message: "Only creators or admins can access this resource area",
      });
    }

    req.account = user;
    return next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
