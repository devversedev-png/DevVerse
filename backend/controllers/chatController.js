const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

/* ==============================
   CREATE OR GET CUSTOMER CHAT
============================== */

const createOrGetConversation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email role"
    );

    if (!user || user.role !== "customer") {
      return res.status(404).json({
        success: false,
        message: "Customer account not found",
      });
    }

    let conversation = await Conversation.findOne({
      userId: user._id,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        userId: user._id,
        customerName: user.name,
        customerEmail: user.email,
        lastMessage: "",
      });
    }

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Create/Get conversation error:", error);

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

    if (
      req.user.role !== "admin" &&
      String(conversation.userId) !== String(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot access this conversation",
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
    const conversations = await Conversation.find()
      .sort({
        updatedAt: -1,
      })
      .lean();

    const userIds = conversations.map(
      (conversation) => conversation.userId
    );

    const users = await User.find({
      _id: { $in: userIds },
    })
      .select("online lastSeen")
      .lean();

    const userMap = {};

    users.forEach((user) => {
      userMap[user._id.toString()] = user;
    });

    const updatedConversations = conversations.map(
      (conversation) => {
        const customer =
          userMap[conversation.userId.toString()];

        return {
          ...conversation,
          online: customer?.online || false,
          lastSeen: customer?.lastSeen || null,
        };
      }
    );

    return res.status(200).json({
      success: true,
      conversations: updatedConversations,
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