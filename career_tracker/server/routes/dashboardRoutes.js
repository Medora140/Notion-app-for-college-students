const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const { getStats } = require("../controllers/dashboardController");

router.get("/stats", auth, getStats);

module.exports = router;
