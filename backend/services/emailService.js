const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

transporter.verify((error) => {
  if (error) {
    console.log("SMTP Connection Failed:", error.message);
  } else {
    console.log("SMTP Ready");
  }
});

// Send OTP to customer
const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"DevVerse" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your DevVerse Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to DevVerse</h2>
        <p>Your verification code is:</p>

        <h1 style="letter-spacing: 8px;">
          ${otp}
        </h1>

        <p>This OTP will expire in 5 minutes.</p>
        <p>If you did not request this code, you can ignore this email.</p>
      </div>
    `,
  });
};

// Notify admin when a customer logs in
const sendCustomerLoginNotification = async (user) => {
  await transporter.sendMail({
    from: `"DevVerse Website" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `DevVerse: ${user.name} logged in`,
    html: `
      <h2>Customer Login Notification</h2>
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    `,
  });
};

const sendAdminMessageNotification = async (user, message) => {
  const adminChatUrl = `${process.env.FRONTEND_URL}/admin/chats`;

  await transporter.sendMail({
    from: `"DevVerse Chat" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New message from ${user.name}`,
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        background: #f8f9fc;
        border-radius: 16px;
      ">
        <h2>New DevVerse Chat Message</h2>

        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>

        <div style="
          background: white;
          padding: 18px;
          border-radius: 12px;
          margin: 20px 0;
          border-left: 4px solid #7c3aed;
        ">
          ${message}
        </div>

        <a
          href="${adminChatUrl}"
          style="
            display: inline-block;
            padding: 14px 24px;
            background: #7c3aed;
            color: white;
            text-decoration: none;
            border-radius: 10px;
            font-weight: bold;
          "
        >
          Open Admin Chat
        </a>
      </div>
    `,
  });
};

// Notify customer when admin replies
const sendCustomerReplyNotification = async (
  customerEmail,
  message
) => {
  const chatUrl = `${process.env.FRONTEND_URL}/chat`;

  await transporter.sendMail({
    from: `"DevVerse Support" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: "You have a new reply from DevVerse",
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        background: #f8f9fc;
        border-radius: 16px;
      ">
        <h2 style="color: #111827;">
          New message from DevVerse
        </h2>

        <p style="color: #6b7280;">
          Our team has replied to your conversation.
        </p>

        <div style="
          background: white;
          padding: 18px;
          border-radius: 12px;
          margin: 20px 0;
          border-left: 4px solid #7c3aed;
        ">
          ${message}
        </div>

        <a
          href="${chatUrl}"
          style="
            display: inline-block;
            padding: 14px 24px;
            background: #7c3aed;
            color: white;
            text-decoration: none;
            border-radius: 10px;
            font-weight: bold;
          "
        >
          Open Conversation
        </a>

        <p style="
          margin-top: 25px;
          font-size: 13px;
          color: #9ca3af;
        ">
          Login to DevVerse if your session has expired.
        </p>
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