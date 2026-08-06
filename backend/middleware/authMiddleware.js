const jwt = require("jsonwebtoken");

/* ==============================
   VERIFY JWT TOKEN
============================== */

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Session expired. Please log in again."
        : "Invalid session. Please log in again.";

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

/* ==============================
   ADMIN ONLY
============================== */

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

/* ==============================
   CUSTOMER ONLY
============================== */

const customerOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "customer" || !req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Customer access required",
    });
  }

  next();
};

module.exports = {
  protect,
  adminOnly,
  customerOnly,
};
