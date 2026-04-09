const express = require("express");
const {
  createDoctor,
  getDoctors,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const validate = require("../middleware/validateMiddleware");
const { doctorSchema } = require("../validators/schemas");

const router = express.Router();

router.use(authenticate);
router.get("/", authorize("admin", "staff", "doctor"), getDoctors);
router.post("/", authorize("admin"), validate(doctorSchema), createDoctor);
router.route("/:id").put(authorize("admin"), validate(doctorSchema), updateDoctor).delete(authorize("admin"), deleteDoctor);

module.exports = router;
