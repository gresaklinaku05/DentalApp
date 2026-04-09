const express = require("express");
const {
  createHistory,
  getHistory,
  updateHistory,
  deleteHistory,
} = require("../controllers/patientHistoryController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const validate = require("../middleware/validateMiddleware");
const { patientHistorySchema } = require("../validators/schemas");

const router = express.Router();

router.use(authenticate, authorize("admin", "doctor"));
router.route("/").post(validate(patientHistorySchema), createHistory).get(getHistory);
router.route("/:id").put(validate(patientHistorySchema), updateHistory).delete(deleteHistory);

module.exports = router;
