const express = require("express");

const {
  adminLogin,
  visitorSession,
} = require("../controllers/authController");

const router = express.Router();

/* ==============================
   AUTH ROUTES
   (Customer OTP login was removed. Visitors no longer log in.)
============================== */

// Admin email + password login
router.post("/admin-login", adminLogin);

// Chat session for a visitor, based on the email they entered
router.post("/visitor-session", visitorSession);

module.exports = router;
