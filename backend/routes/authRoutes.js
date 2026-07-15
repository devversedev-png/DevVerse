const express = require("express");

const {
  checkEmail,
  sendOTP,
  verifyOTP,
  adminLogin,
} = require("../controllers/authController");

const router = express.Router();

/* ==============================
   AUTH ROUTES
============================== */

// Check whether entered email is admin or customer
router.post("/check-email", checkEmail);

// Send OTP to normal customer
router.post("/send-otp", sendOTP);

// Verify customer OTP and login
router.post("/verify-otp", verifyOTP);

// Admin email + password login
router.post("/admin-login", adminLogin);

module.exports = router;