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

    const isAdmin =
      normalizedEmail === process.env.ADMIN_EMAIL.toLowerCase().trim();

    res.status(200).json({
      success: true,
      isAdmin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==============================
   SEND CUSTOMER OTP
============================== */

const sendOTP = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Prevent admin from using customer OTP flow
    if (
      normalizedEmail === process.env.ADMIN_EMAIL.toLowerCase().trim()
    ) {
      return res.status(403).json({
        success: false,
        message: "Please use admin login",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    // Remove previous OTP
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

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP error:", error);

    res.status(500).json({
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
    let user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        role: "customer",
        isVerified: true,
        lastLogin: new Date(),
      });
    } else {
      user.name = name.trim();
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

module.exports = {
  checkEmail,
  sendOTP,
  verifyOTP,
  adminLogin,
};