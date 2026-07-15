const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

/* ==============================
   CREATE OR GET CUSTOMER CHAT
============================== */

const createOrGetConversation = async (req, res) => {
  try {
    const { userId, name, email } = req.body;

    if (!userId || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "User information is required",
      });
    }

    let conversation = await Conversation.findOne({
      userId,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        userId,
        customerName: name,
        customerEmail: email,
        lastMessage: "",
      });
    }

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error(
      "Create/Get conversation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load conversation",
    });
  }
};

/* ==============================
   GET CONVERSATION MESSAGES
============================== */

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation =
      await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const messages = await Message.find({
      conversationId,
    }).sort({
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load messages",
    });
  }
};

/* ==============================
   ADMIN: GET ALL CONVERSATIONS
============================== */

const getAllConversations = async (req, res) => {
  try {
    const conversations =
      await Conversation.find().sort({
        updatedAt: -1,
      });

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error(
      "Get conversations error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load conversations",
    });
  }
};

module.exports = {
  createOrGetConversation,
  getMessages,
  getAllConversations,
};