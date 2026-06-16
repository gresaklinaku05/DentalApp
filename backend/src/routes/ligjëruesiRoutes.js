const express = require("express");
const {
  createLecturer,
  getLecturers,
  updateLecturer,
} = require("../controllers/ligjëruesiController");
const authenticate = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { lecturerSchema } = require("../validators/schemas");

const router = express.Router();

router.use(authenticate);
router.route("/").get(getLecturers).post(validate(lecturerSchema), createLecturer);
router.route("/:id").put(validate(lecturerSchema), updateLecturer);

module.exports = router;