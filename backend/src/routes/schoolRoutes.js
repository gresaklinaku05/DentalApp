const express = require("express");
const {
  createSchool,
  getSchools,
  updateSchool,
  deleteSchool,
} = require("../controllers/schoolController");
const authenticate = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { schoolSchema } = require("../validators/schemas");

const router = express.Router();

router.use(authenticate);
router.route("/").get(getSchools).post(validate(schoolSchema), createSchool);
router.route("/:id").put(validate(schoolSchema), updateSchool).delete(deleteSchool);

module.exports = router;
