const Lead = require("../models/Lead");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A second request from the same email inside this window is treated as the
// same visit, so refreshing the page does not inflate the count.
const SAME_VISIT_WINDOW_MS = 30 * 60 * 1000;

/* ==============================
   PUBLIC: RECORD A VISIT
============================== */

const recordVisit = async (req, res) => {
  try {
    const email = String(req.body?.email || "")
      .toLowerCase()
      .trim();

    if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const rawPath = String(req.body?.path || "/").slice(0, 120);
    const path = rawPath.startsWith("/") ? rawPath : "/";

    const now = new Date();

    let lead = await Lead.findOne({ email });

    if (!lead) {
      lead = await Lead.create({
        email,
        visitCount: 1,
        firstVisitAt: now,
        lastVisitAt: now,
        lastPath: path,
      });
    } else {
      const sinceLast = now.getTime() - lead.lastVisitAt.getTime();

      if (sinceLast > SAME_VISIT_WINDOW_MS) {
        lead.visitCount += 1;
      }

      lead.lastVisitAt = now;
      lead.lastPath = path;
      await lead.save();
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Record visit error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not save your visit.",
    });
  }
};

/* ==============================
   ADMIN: LIST LEADS
============================== */

const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .sort({ lastVisitAt: -1 })
      .select("email visitCount firstVisitAt lastVisitAt lastPath")
      .lean();

    const totalVisits = leads.reduce(
      (sum, lead) => sum + (lead.visitCount || 0),
      0
    );

    return res.status(200).json({
      success: true,
      totalLeads: leads.length,
      totalVisits,
      leads,
    });
  } catch (error) {
    console.error("Get leads error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not load leads.",
    });
  }
};

module.exports = { recordVisit, getLeads };
