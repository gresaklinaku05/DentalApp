const express = require("express");
const { getOverview, getAnalytics } = require("../controllers/dashboardController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate);
router.get("/overview", getOverview);
router.get("/analytics", getAnalytics);

module.exports = router;
