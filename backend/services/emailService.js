const axios = require("axios");

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const getFrontendUrl = () =>
  (
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    "http://localhost:5173"
  ).replace(/\/$/, "");

const sendEmail = async ({ to, subject, htmlContent }) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is missing");
  }

  if (!process.env.EMAIL_USER) {
    throw new Error("EMAIL_USER is missing");
  }

  try {
    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: {
          name: "DevVerse",
          email: process.env.EMAIL_USER,
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        htmlContent,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
        timeout: 15000,
      }
    );

    return response.data;
  } catch (error) {
    const providerMessage =
      error.response?.data?.message ||
      error.response?.data ||
      error.message;

    console.error("Email API error:", providerMessage);

    throw new Error(
      typeof providerMessage === "string"
        ? providerMessage
        : "Email service failed"
    );
  }
};

/* ==============================
   SEND OTP
============================== */

const sendOTPEmail = async (email, otp) => {
  return sendEmail({
    to: email,
    subject: "Your DevVerse Verification Code",
    htmlContent: `
      <div style="font-family:Arial,sans-serif;padding:20px">
        <h2>Welcome to DevVerse</h2>

        <p>Your verification code is:</p>

        <h1 style="letter-spacing:8px">
          ${otp}
        </h1>

        <p>This OTP will expire in 5 minutes.</p>

        <p>
          If you did not request this code,
          you can ignore this email.
        </p>
      </div>
    `,
  });
};

/* ==============================
   CUSTOMER LOGIN NOTIFICATION
============================== */

const sendCustomerLoginNotification = async (user) => {
  return sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `DevVerse: ${user.name} logged in`,
    htmlContent: `
      <div style="font-family:Arial,sans-serif;padding:20px">
        <h2>Customer Login Notification</h2>

        <p>
          <strong>Name:</strong>
          ${user.name}
        </p>

        <p>
          <strong>Email:</strong>
          ${user.email}
        </p>

        <p>
          <strong>Time:</strong>
          ${new Date().toLocaleString()}
        </p>
      </div>
    `,
  });
};

/* ==============================
   ADMIN MESSAGE NOTIFICATION
============================== */

const sendAdminMessageNotification = async (user, message) => {
  const adminChatUrl = `${getFrontendUrl()}/admin/chats`;

  return sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `New message from ${user.name}`,
    htmlContent: `
      <div style="
        font-family:Arial,sans-serif;
        max-width:600px;
        margin:auto;
        padding:30px;
        background:#f8f9fc;
        border-radius:16px;
      ">
        <h2>New DevVerse Chat Message</h2>

        <p>
          <strong>Name:</strong>
          ${user.name}
        </p>

        <p>
          <strong>Email:</strong>
          ${user.email}
        </p>

        <div style="
          background:white;
          padding:18px;
          border-radius:12px;
          margin:20px 0;
          border-left:4px solid #7c3aed;
        ">
          ${message}
        </div>

        <a
          href="${adminChatUrl}"
          style="
            display:inline-block;
            padding:14px 24px;
            background:#7c3aed;
            color:white;
            text-decoration:none;
            border-radius:10px;
            font-weight:bold;
          "
        >
          Open Admin Chat
        </a>
      </div>
    `,
  });
};

/* ==============================
   CUSTOMER REPLY NOTIFICATION
============================== */

const sendCustomerReplyNotification = async (
  customerEmail,
  message
) => {
  const chatUrl = `${getFrontendUrl()}/chat`;

  return sendEmail({
    to: customerEmail,
    subject: "You have a new reply from DevVerse",
    htmlContent: `
      <div style="
        font-family:Arial,sans-serif;
        max-width:600px;
        margin:auto;
        padding:30px;
        background:#f8f9fc;
        border-radius:16px;
      ">
        <h2 style="color:#111827">
          New message from DevVerse
        </h2>

        <p style="color:#6b7280">
          Our team has replied to your conversation.
        </p>

        <div style="
          background:white;
          padding:18px;
          border-radius:12px;
          margin:20px 0;
          border-left:4px solid #7c3aed;
        ">
          ${message}
        </div>

        <a
          href="${chatUrl}"
          style="
            display:inline-block;
            padding:14px 24px;
            background:#7c3aed;
            color:white;
            text-decoration:none;
            border-radius:10px;
            font-weight:bold;
          "
        >
          Open Conversation
        </a>
      </div>
    `,
  });
};

module.exports = {
  sendOTPEmail,
  sendCustomerLoginNotification,
  sendAdminMessageNotification,
  sendCustomerReplyNotification,
};