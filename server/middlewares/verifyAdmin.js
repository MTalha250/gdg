import Admin from "../models/admin.js";

const verifyAdmin = async (req, res, next) => {
  try {
    const id = req.userId;
    const admin = await Admin.findById(id);
    if (!admin) {
      res.status(404).json({ message: "You are not an admin" });
      return;
    }
    if (admin.role && admin.role !== "admin") {
      res.status(403).json({ message: "Admin access required" });
      return;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

export default verifyAdmin;
