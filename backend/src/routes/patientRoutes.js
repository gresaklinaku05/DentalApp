const express = require("express");
const {
  createPatient,
  getPatients,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const validate = require("../middleware/validateMiddleware");
const { patientSchema } = require("../validators/schemas");

const router = express.Router();

router.use(authenticate);
router.route("/").post(authorize("admin"), validate(patientSchema), createPatient).get(getPatients);
router.route("/:id").put(authorize("admin"), validate(patientSchema), updatePatient).delete(authorize("admin"), deletePatient);

module.exports = router;
