const express = require("express");

const {
  listPublic,
  getImage,
  listAll,
  create,
  update,
  remove,
} = require("../controllers/projectController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/* Public: what the website shows */
router.get("/", listPublic);
router.get("/:id/image/:index", getImage);

/* Admin: manage projects */
router.get("/manage/all", protect, adminOnly, listAll);
router.post("/", protect, adminOnly, create);
router.put("/:id", protect, adminOnly, update);
router.delete("/:id", protect, adminOnly, remove);

module.exports = router;
