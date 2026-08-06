// const jwt = require("jsonwebtoken");

// /* ==============================
//    VERIFY JWT TOKEN
// ============================== */

// const protect = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication required",
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     req.user = decoded;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };

// /* ==============================
//    ADMIN ONLY
// ============================== */

// const adminOnly = (req, res, next) => {
//   if (!req.user || req.user.role !== "admin") {
//     return res.status(403).json({
//       success: false,
//       message: "Admin access required",
//     });
//   }

//   next();
// };

// module.exports = {
//   protect,
//   adminOnly,
// };

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    console.log("=================================");
    console.log("AUTH HEADER:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No Bearer token");

      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);

    req.user = decoded;

    next();
  } catch (err) {
    console.log("JWT VERIFY ERROR:", err.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = {
  protect,
  adminOnly,
};