const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const OTP = require("../models/OTP");

const {
  sendOTPEmail,
  sendCustomerLoginNotification,
} = require("../services/emailService");

/* ==============================
   CHECK EMAIL TYPE
============================== */

const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Admin login
    if (
      normalizedEmail ===
      process.env.ADMIN_EMAIL.toLowerCase().trim()
    ) {
      return res.status(200).json({
        success: true,
        isAdmin: true,
        isExistingUser: false,
      });
    }

    // Existing customer?
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (user) {
      return res.status(200).json({
        success: true,
        isAdmin: false,
        isExistingUser: true,
        name: user.name,
        email: user.email,
      });
    }

    // New customer
    return res.status(200).json({
      success: true,
      isAdmin: false,
      isExistingUser: false,
    });

  } catch (error) {
    console.error("Check Email Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/* ==============================
   SEND CUSTOMER OTP
============================== */

const sendOTP = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Prevent admin OTP login
    if (
      normalizedEmail ===
      process.env.ADMIN_EMAIL.toLowerCase().trim()
    ) {
      return res.status(403).json({
        success: false,
        message: "Please use admin login",
      });
    }

    // Check whether user already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    // New user must provide name
    if (!existingUser && !name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    // Delete old OTPs
    await OTP.deleteMany({
      email: normalizedEmail,
    });

    // Save new OTP
    await OTP.create({
      email: normalizedEmail,
      otp,
      expiresAt,
    });

    // Send OTP email
    await sendOTPEmail(normalizedEmail, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      isExistingUser: !!existingUser,
    });

  } catch (error) {
    console.error("Send OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

/* ==============================
   VERIFY CUSTOMER OTP
============================== */

const verifyOTP = async (req, res) => {
  try {
    const { name, email, otp } = req.body;

    if (!name || !email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Name, email and OTP are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Request a new OTP.",
      });
    }

    if (otpRecord.otp !== otp.toString()) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Create or update customer
    // Find existing customer
    let user = await User.findOne({
      email: normalizedEmail,
    });

    // New customer
    if (!user) {
      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name is required",
        });
      }

      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        role: "customer",
        isVerified: true,
        lastLogin: new Date(),
      });
    }
    // Existing customer
    else {
      user.isVerified = true;
      user.lastLogin = new Date();

      await user.save();
    }
    // Delete OTP after successful verification
    await OTP.deleteMany({
      email: normalizedEmail,
    });

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Notify admin about customer login
    sendCustomerLoginNotification(user).catch((error) => {
      console.error(
        "Login notification email error:",
        error.message
      );
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);

    res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};

/* ==============================
   ADMIN LOGIN
============================== */

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (
      normalizedEmail !==
      process.env.ADMIN_EMAIL.toLowerCase().trim()
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        role: "admin",
        email: normalizedEmail,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        name: "DevVerse Admin",
        email: normalizedEmail,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      success: false,
      message: "Admin login failed",
    });
  }
};


/* ==============================
   VISITOR CHAT SESSION (no login page)
   A visitor gives an email; a random per-browser key keeps the chat theirs.
============================== */

const visitorSession = async (req, res) => {
  try {
    const email = String(req.body?.email || "").toLowerCase().trim();
    const visitorKey = String(req.body?.visitorKey || "");
    const name = String(req.body?.name || "").trim().slice(0, 60);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (visitorKey.length < 16 || visitorKey.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Invalid visitor session.",
      });
    }

    if (
      process.env.ADMIN_EMAIL &&
      email === process.env.ADMIN_EMAIL.toLowerCase().trim()
    ) {
      return res.status(403).json({
        success: false,
        message: "This email can't be used for chat.",
      });
    }

    const keyHash = crypto
      .createHash("sha256")
      .update(visitorKey)
      .digest("hex");

    let user = await User.findOne({ email }).select("+visitorKeyHash");

    if (!user) {
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        role: "customer",
        isVerified: false,
        visitorKeyHash: keyHash,
        lastLogin: new Date(),
      });
    } else if (user.role !== "customer" || user.visitorKeyHash !== keyHash) {
      return res.status(409).json({
        success: false,
        message:
          "A chat for this email was started on another device. Please use the project form or email us instead.",
      });
    } else {
      user.lastLogin = new Date();
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Visitor session error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not start the chat.",
    });
  }
};

module.exports = {
  visitorSession,
  checkEmail,
  sendOTP,
  verifyOTP,
  adminLogin,
};