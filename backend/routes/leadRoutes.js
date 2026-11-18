const express = require("express");

const { recordVisit, getLeads } = require("../controllers/leadController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Anyone can record a visit with their email.
router.post("/visit", recordVisit);

// Only the admin can see the list.
router.get("/", protect, adminOnly, getLeads);

module.exports = router;
