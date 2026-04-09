const express = require("express");
const {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const validate = require("../middleware/validateMiddleware");
const { appointmentSchema } = require("../validators/schemas");

const router = express.Router();

router.use(authenticate);
router.use(authorize("admin", "staff"));
router.route("/").post(validate(appointmentSchema), createAppointment).get(getAppointments);
router.route("/:id").put(validate(appointmentSchema), updateAppointment).delete(deleteAppointment);

module.exports = router;
