const Contact = require("../models/Contact");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const {
  sendAdminMessageNotification,
} = require("../services/emailService");

const submitContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      projectType,
      budget,
      message,
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    /* ==============================
       SAVE CONTACT
    ============================== */

    const enquiry = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone,
      projectType,
      budget,
      message,
    });

    /* ==============================
       FIND USER
    ============================== */

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (user) {
      /* ==============================
         FIND / CREATE CONVERSATION
      ============================== */

      let conversation = await Conversation.findOne({
        userId: user._id,
      });

      if (!conversation) {
        conversation = await Conversation.create({
          userId: user._id,
          customerName: user.name,
          customerEmail: user.email,
          phone,
          projectType,
          budget,
          lastMessage: message,
        });
      } else {
        conversation.phone = phone || "";
        conversation.projectType = projectType || "";
        conversation.budget = budget || "";
        conversation.lastMessage = message;

        await conversation.save();
      }

      /* ==============================
         SAVE FIRST CHAT MESSAGE
      ============================== */

      await Message.create({
        conversationId: conversation._id,
        sender: "customer",
        message: `🚀 New Project Enquiry

👤 Name
${name}

📧 Email
${email}

📱 Phone
${phone || "-"}

💼 Project
${projectType || "-"}

💰 Budget
${budget || "-"}

━━━━━━━━━━━━━━━━━━━━━━

${message}

━━━━━━━━━━━━━━━━━━━━━━

Submitted from DevVerse Contact Form`,
      });
    }

    /* ==============================
       EMAIL ADMIN
    ============================== */

    sendAdminMessageNotification(
      {
        name,
        email,
      },
      `🚀 New Project Enquiry

Phone : ${phone || "-"}

Project : ${projectType || "-"}

Budget : ${budget || "-"}

----------------------------

${message}`
    ).catch((err) => console.log(err.message));

    return res.json({
      success: true,
      message: "Message sent successfully.",
      enquiry,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Unable to send message.",
    });
  }
};

module.exports = {
  submitContact,
};