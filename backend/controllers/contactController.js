const Contact = require("../models/Contact");

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

    if (
      !name ||
      !email ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const enquiry = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone,
      projectType,
      budget,
      message,
    });

    // Email notification to admin
    sendAdminMessageNotification(
      {
        name,
        email,
      },
      `
      📞 Contact Enquiry

Phone : ${phone || "-"}

Project :
${projectType || "-"}

Budget :
${budget || "-"}

---------------------------------

${message}
      `
    ).catch((err) =>
      console.log(err.message)
    );

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