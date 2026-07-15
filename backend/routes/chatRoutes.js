const express = require("express");

const {
  createOrGetConversation,
  getMessages,
  getAllConversations,
} = require("../controllers/chatController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

/* CUSTOMER: CREATE OR GET OWN CONVERSATION */
router.post(
  "/conversation",
  protect,
  createOrGetConversation
);

/* CUSTOMER + ADMIN: GET MESSAGES */
router.get(
  "/messages/:conversationId",
  protect,
  getMessages
);

/* ADMIN: GET ALL CONVERSATIONS */
router.get(
  "/conversations",
  protect,
  adminOnly,
  getAllConversations
);

module.exports = router;