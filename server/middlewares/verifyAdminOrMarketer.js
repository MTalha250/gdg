import Admin from "../models/admin.js";

const verifyAdminOrMarketer = async (req, res, next) => {
  try {
    const id = req.userId;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "You are not authorized" });
    }
    if (admin.role !== "admin" && admin.role !== "marketer") {
      return res.status(403).json({ message: "Insufficient privileges" });
    }
    req.userRole = admin.role;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default verifyAdminOrMarketer;
