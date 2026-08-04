const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, ".env") });

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const connectDB = require("./config/db");
const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");

const Conversation = require("./models/Conversation");
const Message = require("./models/Message");
const contactRoutes = require("./routes/contactRoutes");

const {
  sendAdminMessageNotification,
  sendCustomerReplyNotification,
} = require("./services/emailService");

/* ==============================
   CONNECT DATABASE
============================== */

connectDB();

// const allowedOrigins = process.env.FRONTEND_URL
//   .split(",")
//   .map(origin => origin.trim());

// // const server = http.createServer(app);


/* ==============================
   MIDDLEWARE
============================== */

const allowedOrigins = (process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

app.use(express.json());

/* ==============================
   API ROUTES
============================== */

app.use("/api/auth", authRoutes);
console.log("AUTH ROUTES REGISTERED");

app.post("/api/test-auth", (req, res) => {
  res.json({
    success: true,
    message: "Auth test route working"
  });
});
app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes);

/* ==============================
   SOCKET.IO
============================== */

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  /* ==============================
     JOIN CONVERSATION
  ============================== */

  socket.on(
    "join_conversation",
    (conversationId) => {
      if (!conversationId) return;

      socket.join(conversationId);

      console.log(
        `User ${socket.id} joined conversation ${conversationId}`
      );
    }
  );

  /* ==============================
     SEND MESSAGE
  ============================== */

  socket.on("send_message", async (data) => {
    try {
      const {
        conversationId,
        sender,
        message,
      } = data;

      /* VALIDATION */

      if (
        !conversationId ||
        !["customer", "admin"].includes(sender) ||
        !message?.trim()
      ) {
        return;
      }

      /* FIND CONVERSATION */

      const conversation =
        await Conversation.findById(
          conversationId
        );

      if (!conversation) {
        console.log(
          "Conversation not found:",
          conversationId
        );
        return;
      }

      const cleanMessage = message.trim();

      /* SAVE MESSAGE */

      const newMessage =
        await Message.create({
          conversationId,
          sender,
          message: cleanMessage,
        });

      /* UPDATE CONVERSATION */

      conversation.lastMessage =
        cleanMessage;

      await conversation.save();

      /* SEND REAL-TIME MESSAGE */

      io.to(conversationId).emit(
        "receive_message",
        newMessage
      );

      /* UPDATE ADMIN INBOX */

      io.emit(
        "conversation_updated",
        {
          conversationId,
          lastMessage: cleanMessage,
          sender,
          updatedAt:
            newMessage.createdAt,
        }
      );

      /* ==============================
         EMAIL NOTIFICATIONS
      ============================== */

      // Customer sends message
      if (sender === "customer") {
        sendAdminMessageNotification(
          {
            name:
              conversation.customerName,
            email:
              conversation.customerEmail,
          },
          cleanMessage
        ).catch((error) => {
          console.error(
            "Admin notification error:",
            error.message
          );
        });
      }

      // Admin replies
      if (sender === "admin") {
        sendCustomerReplyNotification(
          conversation.customerEmail,
          cleanMessage
        ).catch((error) => {
          console.error(
            "Customer notification error:",
            error.message
          );
        });
      }
    } catch (error) {
      console.error(
        "Socket message error:",
        error.message
      );
    }
  });

  /* ==============================
     EDIT MESSAGE
  ============================== */

  socket.on(
    "edit_message",
    async (data) => {
      try {
        const {
          messageId,
          conversationId,
          message,
        } = data;

        if (
          !messageId ||
          !conversationId ||
          !message?.trim()
        ) {
          return;
        }

        const updatedMessage =
          await Message.findOneAndUpdate(
            {
              _id: messageId,
              conversationId,
            },
            {
              message: message.trim(),
              edited: true,
            },
            {
              new: true,
            }
          );

        if (!updatedMessage) {
          return;
        }

        io.to(conversationId).emit(
          "message_edited",
          updatedMessage
        );
      } catch (error) {
        console.error(
          "Edit message error:",
          error.message
        );
      }
    }
  );

  /* ==============================
     DISCONNECT
  ============================== */

  socket.on("disconnect", () => {
    console.log(
      "User disconnected:",
      socket.id
    );
  });
});

/* ==============================
   TEST ROUTE
============================== */

app.post("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "POST API is working"
    });
});

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "DevVerse backend is running 🚀"
    });
});
 

/* ==============================
   START SERVER
============================== */

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `DevVerse backend running on port ${PORT}`
  );
});