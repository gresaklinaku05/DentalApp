const express = require("express");
const { createStudent, getStudents } = require("../controllers/studentController");
const authenticate = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { studentSchema } = require("../validators/schemas");

const router = express.Router();

router.use(authenticate);
router.route("/").get(getStudents).post(validate(studentSchema), createStudent);

module.exports = router;
