const express = require("express");
const { getAuditLogs } = require("../controllers/auditLogController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");

const router = express.Router();

router.use(authenticate, authorize("admin"));
router.get("/", getAuditLogs);

module.exports = router;
